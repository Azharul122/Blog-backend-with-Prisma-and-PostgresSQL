import { prisma } from "../../../lib/prisma";

interface commentsPayload {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
}

interface UpdateCommentPayload {
  content: string;
}

const createComments = async (data: commentsPayload) => {
  if (data.parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: data.parentId },
    });

    if (!parentComment) {
      throw new Error("Parent comment not found");
    }

    // Extra safety: parent comment ta ki oi ekoi post er (mismatch prevent korar jonno)
    if (parentComment.postId !== data.postId) {
      throw new Error("Parent comment does not belong to this post");
    }
  }

  const result = await prisma.comment.create({ data: data });
  return result;
};

const getAllComments = async () => {
  // Step 1: Database theke SHOB comment ekbar e flat list hishebe anun
  const allComments = await prisma.comment.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      author: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Step 2: Map banano - id diye quick lookup korar jonno
  const commentMap = new Map<string, any>();
  const rootComments: any[] = [];

  for (const comment of allComments) {
    commentMap.set(comment.id, { ...comment, replies: [] });
  }

  // Step 3: Prottek comment ke tar parent er 'replies' e link korun
  for (const comment of allComments) {
    const current = commentMap.get(comment.id);

    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(current);
      }
    } else {
      rootComments.push(current);
    }
  }

  return rootComments;
};

const updateComment = async (
  commentId: string,
  userId: string,
  data: UpdateCommentPayload
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment || comment.deletedAt) {
    throw new Error("Comment not found");
  }

  if (comment.authorId !== userId) {
    throw new Error("You are not authorized to update this comment");
  }

  const result = await prisma.comment.update({
    where: { id: commentId },
    data: { content: data.content },
  });

  return result;
};

// export const commentService = {
//   getAllComments,
// };


const deleteComment = async (commentId: string, userId: string, userRole: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment || comment.deletedAt) {
    throw new Error("Comment not found");
  }

  const isOwner = comment.authorId === userId;
  const isAdmin = userRole === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new Error("You are not authorized to delete this comment");
  }

  // Recursive function - ei comment ar tar shob nested reply (jekono depth) er id ber korun
  const idsToDelete = await getAllReplyIds(commentId);
  idsToDelete.push(commentId); 

  // Shob ek shathe soft-delete korun
  await prisma.comment.updateMany({
    where: { id: { in: idsToDelete } },
    data: { deletedAt: new Date() },
  });

  return { message: "Comment and its replies deleted successfully" };
};

const getAllReplyIds = async (parentId: string): Promise<string[]> => {
  const directReplies = await prisma.comment.findMany({
    where: { parentId, deletedAt: null },
    select: { id: true },
  });

  let allIds: string[] = directReplies.map((r) => r.id);

  for (const reply of directReplies) {
    const nestedIds = await getAllReplyIds(reply.id); // recursion - jekono depth handle korbe
    allIds = allIds.concat(nestedIds);
  }

  return allIds;
};


export const commentService = {
  createComments,
  getAllComments,
  updateComment,
  deleteComment
};

import { prisma } from "../../../lib/prisma";
import {
  getPaginationParams,
  buildPaginationMeta,
} from "../../utils/pagination";

interface GetCommentsFilters {
  page?: number;
  limit?: number;
}

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

    if (parentComment.postId !== data.postId) {
      throw new Error("Parent comment does not belong to this post");
    }
  }

  const result = await prisma.comment.create({ data: data });
  return result;
};

const getAllComments = async (filters: GetCommentsFilters) => {
  const { page, limit, skip } = getPaginationParams({
    page: filters.page,
    limit: filters.limit,
  });

  const where = { deletedAt: null };

  const [rootComments, total] = await prisma.$transaction([
    prisma.comment.findMany({
      where: { ...where, parentId: null },
      orderBy: { createdAt: "asc" },
      skip,
      take: limit,
      include: {
        author: { select: { id: true, name: true } },
      },
    }),
    prisma.comment.count({ where: { ...where, parentId: null } }),
  ]);

  if (rootComments.length === 0) {
    return { comments: [], meta: buildPaginationMeta(total, page, limit) };
  }

  const rootIds = rootComments.map((c) => c.id);

  const allReplies = await prisma.comment.findMany({
    where: {
      deletedAt: null,
      parentId: { not: null },
    },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, name: true } },
    },
  });

  const commentMap = new Map<string, any>();

  for (const comment of rootComments) {
    commentMap.set(comment.id, { ...comment, replies: [] });
  }
  for (const comment of allReplies) {
    commentMap.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of allReplies) {
    const current = commentMap.get(comment.id);
    const parent = commentMap.get(comment.parentId as string);
    if (parent) {
      parent.replies.push(current);
    }
  }
  const result = rootIds.map((id) => commentMap.get(id));

  const meta = buildPaginationMeta(total, page, limit);

  return { comments: result, meta };
};

const updateComment = async (
  commentId: string,
  userId: string,
  data: UpdateCommentPayload,
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

const deleteComment = async (
  commentId: string,
  userId: string,
  userRole: string,
) => {
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

  const idsToDelete = await getAllReplyIds(commentId);
  idsToDelete.push(commentId);

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
    const nestedIds = await getAllReplyIds(reply.id);
    allIds = allIds.concat(nestedIds);
  }

  return allIds;
};

// .......................... Handle comment status ...............................

const changeStatus = async (id: string, status: "approve" | "reject") => {
  let isApproved: boolean = false;
  function validateStatus(status: string) {
    if (status == "approve") {
      isApproved = true;
      return "APPROVED";
    }
    if (status == "reject") {
      return "REJECTED";
    }
  }
  const result = await prisma.comment.update({
    where: { id },
    data: { status: validateStatus(status) as any, },
  });
  return result;
};

export const commentService = {
  createComments,
  getAllComments,
  updateComment,
  deleteComment,
  changeStatus,
};

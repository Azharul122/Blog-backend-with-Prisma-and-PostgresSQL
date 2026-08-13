import { prisma } from "../../../lib/prisma";

interface commentsPayload {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
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

const getAllComments = async (postId: string) => {
  const result = await prisma.comment.findMany({
    where: { postId },
    include: { replies: true },
  });
  return result;
};

export const commentService = {
  createComments,
  getAllComments,
};

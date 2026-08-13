import { prisma } from "../../../lib/prisma";

interface commentsPayload {
  content: string;
  postId: string;
  authorId: string;
}

const createComments = async (data: commentsPayload) => {
  const result = await prisma.comment.create({ data: data });
  return result;
};

export const commentService = {
  createComments,
};

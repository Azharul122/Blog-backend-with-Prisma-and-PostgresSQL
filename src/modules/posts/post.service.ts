import { prisma } from "../../../lib/prisma";
import generateSlug from "../../utils/generateSlag";

const createPost = async (data: any) => {
  console.log(data);
  if (!data.authorId) {
    throw new Error("Author ID is required to create a post.");
  }

  if (!data.title || !data.content) {
    throw new Error("Title and content are required to create a post.");
  }

  const slug = generateSlug(data.title);

  const existingPost = await prisma.post.findUnique({ where: { slug } });

  if (existingPost) {
    throw new Error("Post with this slug already exists.");
  }

  const postData: any = {
    title: data.title,
    content: data.content,
    authorId: data.authorId,
    tags: data.tags || [],
    slug: slug,
  };

  const post = await prisma.post.create({
    data: postData,
  });

  return post;
};

// .......................... All Posts ...............................

const getAllPosts = async () => {
  const posts = await prisma.post.findMany({ include: { author: true } });
  return posts;
};

// .......................... Single Post ...............................
const getPostById = async (id: string) => {
  const post = await prisma.post.findUnique({ where: { id } });
  return post;
};

//  .......................... Update Post ...............................
const updatePost = async (id: string, data: any) => {
  const updateSlug = generateSlug(data.title);
  const post = await prisma.post.update({
    where: { id },
    data: { ...data, slug: updateSlug },
  });
  return post;
};

//  .......................... Delete Post ...............................
const deletePost = async (id: string) => {
  // soft delete
  const post = await prisma.post.update({
    where: { id },
    data: { deletedAt: new Date() as any },
  });

  // if already deleted then throw error

  // if (post.deletedAt) {
  //   throw new Error("Post already deleted");
  // }

  return { daletedAt: post.deletedAt };
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};

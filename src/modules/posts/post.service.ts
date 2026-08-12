import { prisma } from "../../../lib/prisma";
import generateSlug from "../../utils/generateSlag";
import { PostFilters } from "../../../types/post";

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

const getAllPosts = async (filters: PostFilters) => {
  const { category, tag, sort, search, published } = filters;

  // ---------- WHERE clause banano ----------
  const where: any = {
    deletedAt: null, // soft-deleted post gula bad
  };

  if (published !== undefined) {
    where.published = published;
  }

  if (category && category.length > 0) {
    where.categories = {
      some: {
        name: { in: category }, // Category model e 'name' field dhore nicchi
      },
    };
  }

  if (tag && tag.length > 0) {
    where.tags = {
      hasSome: tag, // String[] field e je kono ekta tag match korle
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  // ---------- ORDER BY clause banano ----------
  const orderBy: any[] = [];

  if (sort && sort.length > 0) {
    for (const s of sort) {
      if (s === "desc") orderBy.push({ createdAt: "desc" });
      else if (s === "asc") orderBy.push({ createdAt: "asc" });
      else if (s === "popular") orderBy.push({ reviews: { _count: "desc" } });
      else if (s === "featured") orderBy.push({ isFeatured: "desc" });
    }
  }

  if (orderBy.length === 0) {
    orderBy.push({ createdAt: "desc" }); // default sort
  }

  // ---------- Query run korun ----------
  const posts = await prisma.post.findMany({
    where,
    orderBy,
    include: {
      author: { select: { id: true, name: true, email: true } },
      categories: true,
    },
  });

  return posts;
};

// const getAllPosts = async () => {
//   const posts = await prisma.post.findMany({ include: { author: true } });
//   return posts;
// };

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

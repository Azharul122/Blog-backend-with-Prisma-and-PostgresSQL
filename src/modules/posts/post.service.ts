import { prisma } from "../../../lib/prisma";
import generateSlug from "../../utils/generateSlag";
import { PostFilters } from "../../../types/post";
import {
  buildPaginationMeta,
  getPaginationParams,
} from "../../utils/pagination";
import moment from "moment";

const createPost = async (data: any) => {
  if (!data.authorId) {
    throw new Error("Author ID is required to create a post.");
  }

  if (!data.title || !data.content) {
    throw new Error("Title and content are required to create a post.");
  }

  // post under category

  const categoryIds = data?.categories || [];

  // const categories = await prisma.category.findMany({
  //   where: {
  //     id: {
  //       in: categoryIds,
  //     },
  //   },
  // });

  // const categoryNames = categories.map((category) => category.name);

  const slug = generateSlug(data.title);

  const existingPost = await prisma.post.findUnique({ where: { slug } });

  if (existingPost) {
    throw new Error("Post with this slug already exists.");
  }

  // 

  const postData: any = {
    title: data.title,
    content: data.content,
    authorId: data.authorId,
    tags: data.tags || [],
    slug: slug,
    categories: {
      connect: categoryIds.map((id: string) => ({
        id,
      })),
    },
  };

  const post = await prisma.post.create({
    data: postData,
    include: {
      categories: true,
    },
  });

  return post;
};

// .......................... All Posts ...............................

const getAllPosts = async (filters: PostFilters) => {
  const { category, tag, sort, search, published } = filters;

  const where: any = {
    deletedAt: null,
  };

  if (published !== undefined) {
    where.published = published;
  }

  if (category && category.length > 0) {
    where.categories = {
      some: {
        name: { in: category },
      },
    };
  }

  if (filters.dates && filters.dates.length > 0) {
    where.OR = filters.dates.map((date) => ({
      createdAt: {
        gte: moment(date).local().startOf("day").toDate(),
        lte: moment(date).local().endOf("day").toDate(),
      },
    }));
  }

  if (filters.startDate && filters.endDate) {
    where.createdAt = {
      // gte: filters.startDate,
      // lte: filters.endDate,
      gte: moment(filters.startDate).local().startOf("day").toDate(),
      lte: moment(filters.endDate).local().endOf("day").toDate(),
    }
  }

  if (tag && tag.length > 0) {
    where.tags = {
      hasSome: tag,
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: any[] = [];

  if (sort && sort.length > 0) {
    for (const s of sort) {
      if (s === "desc") orderBy.push({ createdAt: "desc" });
      else if (s === "asc") orderBy.push({ createdAt: "asc" });
      else if (s === "popular") orderBy.push({ reviews: { _count: "desc" } });
      else if (s === "featured") orderBy.push({ isFeatured: "desc" });
      else if (s === "name") orderBy.push({ name: "desc" });
      else if (s === "nameAsc") orderBy.push({ name: "asc" });
      else if (s === "priceAsc") orderBy.push({ price: "asc" });
      else if (s === "price") orderBy.push({ price: "desc" });
    }
  }

  if (orderBy.length === 0) {
    orderBy.push({ createdAt: "desc" });
  }

  const { page, limit, skip } = getPaginationParams({
    page: filters.page,
    limit: filters.limit,
  });

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        author: { select: { id: true, name: true, email: true } },
        categories: true,
      },
    }),
    prisma.post.count({ where }),
  ]);

  const meta = buildPaginationMeta(total, page, limit);

  return { meta, posts };
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

  return { daletedAt: post.deletedAt };
};

// .......................... Get Post By Slug ...............................
const getPostBySlug = async (slug: string) => {
  const post = await prisma.post.findUnique({ where: { slug } });
  return post;
};

// .......................... Publish Post ...............................

const publishPost = async (
  id: string,
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED",
) => {
  function published() {
    return status === "PUBLISHED";
  }

  const post = await prisma.post.update({
    where: { id },
    data: { status, published: published() },
  });
  return post;
};

// aprroved post
const approvedPost = async (id: string) => {
  const post = await prisma.post.update({
    where: { id },
    data: { approved: true },
  });
  return post;
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostBySlug,
  publishPost,
  approvedPost,
};

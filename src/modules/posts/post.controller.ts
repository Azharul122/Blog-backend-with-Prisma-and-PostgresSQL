import { Request, Response } from "express";
import { postService } from "./post.service";
import { getUserFromToken } from "../../utils/getUserFromToken";
import checkRestrictedContent from "../../utils/checkRestrictedContent";
import { authService } from "../auth/auth.service";
import { transporter } from "../../lib/mailer";
import { restictedMessageTemplete } from "../../templetes/restictedMessageTemplete";

const createPost = async (req: Request, res: Response) => {
  const token = req.cookies.token as string;
  const user = getUserFromToken(token, req);
  const email = user?.email as string;
  try {
    const data = checkRestrictedContent(req.body.content);
    if (data) {
      await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "Oops we found resticted content in your post",
        html: restictedMessageTemplete(data),
      });
      return  res.status(400).json({ error: data });
    }


    const result = await postService.createPost(req.body);

    res.status(201).json({
      message: "Post created successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

//  .......................... Get All Post ...............................

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { category, tag, sort, search, published, page, limit } = req.query;

    const filters = {
      category: category ? (category as string).split(",") : undefined,
      tag: tag ? (tag as string).split(",") : undefined,
      sort: sort ? (sort as string).split(",") : undefined,
      search: search as string | undefined,
      published: published !== undefined ? published === "true" : undefined,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    const result = await postService.getAllPosts(filters);

    const { meta, posts } = result;

    res.status(200).json({
      message: "Posts fetched successfully",
      success: true,
      meta,
      data: posts,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// .......................... Single Post ..............................
const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ error: "Valid id query param is required" });
    }
    const post = await postService.getPostById(id as string);
    res.status(200).json({
      success: true,
      message: "Single post fetched successfully",
      data: post,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

//  .......................... Update Post ...............................
const updatePost = async (req: Request, res: Response) => {
  // check his own post or not
  const user = getUserFromToken(req.cookies.token as string, req);

  if (!user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const post = await postService.getPostById(req.params.id as string);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  if (post.authorId !== user.id) {
    return res
      .status(401)
      .json({ error: "You are not authorized to update this post" });
  }
  try {
    const result = await postService.updatePost(
      req.params.id as string,
      req.body,
    );
    res.status(200).json({
      message: "Post updated successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

//  .......................... Delete Post ...............................
const deletePost = async (req: Request, res: Response) => {
  try {
    const user = getUserFromToken(req.cookies.token as string, req);

    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const post = await postService.getPostById(req.params.id as string);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.authorId !== user.id && user.role !== "ADMIN") {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    const result = await postService.deletePost(req.params.id as string);

    if (post?.deletedAt)
      return res.status(400).json({
        error: "Post already deleted",
        success: false,
        statusCode: 400,
      });

    res.status(200).json({
      message: "Post deleted successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// .......................... Approved Post ...............................
const approvedPost = async (req: Request, res: Response) => {
  const user = getUserFromToken(req.cookies.token as string, req);

  if (!user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  // only admin can approve
  if (user.role !== "ADMIN") {
    return res.status(401).json({ error: "Only admin can approve post" });
  }
  try {
    const result = await postService.approvedPost(req.params.id as string);
    res.status(200).json({
      message: "Post approved successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// .......................... Publish Post ...............................
const publishPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.publishPost(
      req.params.id as string,
      req.body.status as any,
    );
    res.status(200).json({
      message: "Post published successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// .......................... Get Post By Slug ...............................
const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const result = await postService.getPostBySlug(req.query.slug as string);
    res.status(200).json({
      message: "Post fetched successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const postController = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostBySlug,
  publishPost,
  approvedPost,
};

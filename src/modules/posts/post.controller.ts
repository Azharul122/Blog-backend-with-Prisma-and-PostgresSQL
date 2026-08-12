import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { postService } from "./post.service";

interface CreatePostPayload {
  title: string;
  content: string;
  authorId: string;
  tags?: string[];
}

const createPost = async (req: Request, res: Response) => {
    console.log("Request body:", req.body); 
  try {
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
    const posts = await postService.getAllPosts();
    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const postController = {
  createPost,
  getAllPosts
};

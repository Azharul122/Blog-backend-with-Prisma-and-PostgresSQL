import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    console.log("Request body:", req.body); // Log the request body for debugging
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
export const postController = {
  createPost,
};

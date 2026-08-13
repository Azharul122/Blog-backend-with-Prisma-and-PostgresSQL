import { Request, Response } from "express";

import { commentService } from "./comments.services";
import { getUserFromToken } from "../../utils/getUserFromToken";

const createComment = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token as string;
    const user = getUserFromToken(token, req);
    console.log(user);
    const payload = {
      authorId: user.id as string,
      postId: req.params.id as string,
      content: req.body.content as string,
      parentId: req.body.parentId ?? undefined,
    };

    if (!user) return res.status(401).json({ error: "User not authenticated" });

    if (!payload.postId)
      return res.status(400).json({ error: "Post id is required" });

    if (!payload.content)
      return res.status(400).json({ error: "Content is required" });

    const result = await commentService.createComments(payload);
    res.status(201).json({
      message: "Comment created successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const getAllComments = async (req: Request, res: Response) => {};

export const commentController = {
  createComment,
  getAllComments,
};

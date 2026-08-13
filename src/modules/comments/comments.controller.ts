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

const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await commentService.getAllComments();

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      //   meta,
      data: comments,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const updateCommentController = async (req: Request, res: Response) => {
  const user = getUserFromToken(req.cookies.token as string, req);

  if (!user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const result = await commentService.updateComment(
      req.params.id as string,
      user.id,
      req.body,
    );

    res.status(200).json({
      message: "Comment updated successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// const deleteCommentController = async (req: Request, res: Response) => {
//   const user = getUserFromToken(req.cookies.token as string, req);

//   if (!user) {
//     return res.status(401).json({ error: "User not authenticated" });
//   }

//   try {
//     const result = await commentService.deleteComment(
//       req.params.id as string,
//       user.id,
//       user.role
//     );

//     res.status(200).json({
//       message: result.message,
//       success: true,
//     });
//   } catch (error: any) {
//     res.status(400).json({ error: error.message });
//   }
// };

const deleteCommentController = async (req: Request, res: Response) => {
  const user = getUserFromToken(req.cookies.token as string, req);

  if (!user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const result = await commentService.deleteComment(
      req.params.id as string,
      user.id,
      user.role,
    );

    res.status(200).json({
      message: result.message,
      success: true,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const commentController = {
  createComment,
  getAllComments,
  updateCommentController,
  deleteCommentController,
};

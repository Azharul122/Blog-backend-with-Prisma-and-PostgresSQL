import { Request, Response } from "express";
import { userService } from "./user.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ error: "Valid id query param is required" });
    }
    const user = await userService.getUserById(id as string);
    res.status(200).json({
      success: true,
      message: "Single user fetched successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const getMe = async (req: Request, res: Response) => {
  const token = req.headers.authorization;

  const decodedUserData = token
    ? JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("ascii"))
    : null;

  const userId = decodedUserData?.id;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  try {
    const user = await userService.getMe(userId);
    res.status(200).json({
      success: true,
      message: "Your data fetched successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const userController = {
  getAllUsers,
  getUserById,
  getMe,
};

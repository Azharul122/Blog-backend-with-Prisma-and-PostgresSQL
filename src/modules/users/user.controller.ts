import { Request, Response } from "express";
import { userService } from "./user.service";

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

export const userController = {
  getAllUsers,
  getUserById,
};

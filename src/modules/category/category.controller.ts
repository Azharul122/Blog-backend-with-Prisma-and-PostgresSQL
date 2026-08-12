import { Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.createCategory(req.body);

    res.status(201).json({
      message: "Category created successfully",
      success: true,
      result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.updateCategory(
      req.params.id as string,
      req.body,
    );
    res.status(200).json({
      message: "Category updated successfully",
      success: true,
      result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.deleteCategory(
      req.params.id as string,
    );
    res.status(200).json({
      message: "Category deleted successfully",
      success: true,
      result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const getAllCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(200).json({
      message: "Category fetched successfully",
      success: true,
      result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const categoryController = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
};

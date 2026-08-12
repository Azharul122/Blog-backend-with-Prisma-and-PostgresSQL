import { categoryController } from "./category.controller";
import express from "express";

const router = express.Router();

router.post("/create", categoryController.createCategory);
router.put("/update/:id", categoryController.updateCategory);
router.delete("/delete/:id", categoryController.deleteCategory);
router.get("/all", categoryController.getAllCategory);
// router.get("/single", categoryController.getCategoryById);

export const categoryRouter: any = router;

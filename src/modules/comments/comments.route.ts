import express from "express";
import { commentController } from "./comments.controller";

const router = express.Router();

router.post("/create/:id", commentController.createComment);
router.get("/all", commentController.getAllComments);
router.put("/update/:id", commentController.updateCommentController);
router.delete("/delete/:id", commentController.deleteCommentController);
router.put("/change-status/:id", commentController.changeStatus);


export const commentRouter = router;

import express from "express";
import { commentController } from "./comments.controller";

const router = express.Router();

router.post("/create/:id", commentController.createComment);

export const commentRouter = router;

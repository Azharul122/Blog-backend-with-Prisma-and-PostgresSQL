import express, { Router } from "express";
import { postController } from "./post.controller";

const router = express.Router();

router.post("/create", postController.createPost);
router.post("/all", postController.getAllPosts);

export const postRouter: Router = router;

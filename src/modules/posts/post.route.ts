import express, { Router } from "express";
import { postController } from "./post.controller";

const router = express.Router();

router.post("/create", postController.createPost);
router.put("/update/:id", postController.updatePost);
router.delete("/delete/:id", postController.deletePost);
router.get("/all", postController.getAllPosts);
router.get("/single", postController.getPostById);
router.put("/approve/:id", postController.approvedPost);
router.put("/publish/:id", postController.publishPost);
router.get("/by-slug", postController.getPostBySlug);

export const postRouter: Router = router;

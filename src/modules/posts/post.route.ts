import express, { Router } from "express";
import { postController } from "./post.controller";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/create", authMiddleware(UserRole.ADMIN, UserRole.USER ), postController.createPost);
router.put("/update/:id", authMiddleware(UserRole.ADMIN, UserRole.USER ), postController.updatePost);
router.delete("/delete/:id", authMiddleware(UserRole.ADMIN, UserRole.USER ), postController.deletePost);
router.get("/all", authMiddleware(UserRole.ADMIN, UserRole.USER ), postController.getAllPosts);
router.get("/single", authMiddleware( UserRole.USER ), postController.getPostById);
router.put("/approve/:id", authMiddleware(UserRole.ADMIN), postController.approvedPost);
router.put("/publish/:id", authMiddleware(UserRole.ADMIN, UserRole.USER ), postController.publishPost);
router.get("/by-slug", authMiddleware( UserRole.USER, UserRole.ADMIN ), postController.getPostBySlug);

export const postRouter: Router = router;

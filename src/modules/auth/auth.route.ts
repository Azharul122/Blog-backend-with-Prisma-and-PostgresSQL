import express, { Router } from "express";


const router = express.Router();

router.post("/", postController.createPost);

export const authRouter: Router = router;

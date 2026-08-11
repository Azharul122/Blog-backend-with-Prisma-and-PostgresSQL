import express from "express";
import { userController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/all", userController.getAllUsers);
router.get("/single", userController.getUserById);
router.get("/me", userController.getMe);

export const userRouter: express.Router = router;

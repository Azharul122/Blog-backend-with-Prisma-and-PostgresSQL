import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.get("/all", userController.getAllUsers);
router.get("/single", userController.getUserById);

export const userRouter: express.Router = router;

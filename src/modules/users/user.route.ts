import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.get("/all", userController.getAllUsers);

export const userRouter: express.Router = router;

import express, { Router } from "express";
import { authController } from "./auth.controller";

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOtp);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/resend-otp", authController.resendOtp);

export const authRouter: Router = router;

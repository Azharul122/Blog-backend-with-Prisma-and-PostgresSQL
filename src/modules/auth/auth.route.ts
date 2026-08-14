import express, { Router } from "express";
import { authController } from "./auth.controller";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOtp);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.put("/resend-otp", authController.resendOtp);
router.put("/change-password-verify", authController.changePasswordVerify);
router.put("/change-password", authController.changePassword);
router.post("/google-auth", authController.googleAuth);

export const authRouter: Router = router;

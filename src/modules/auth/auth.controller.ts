import { Request, Response } from "express";
import { authService } from "./auth.service";
import { prisma } from "../../../lib/prisma";

const register = async (req: Request, res: Response) => {
  try {
    const { email, password, phone, address, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await authService.hashPassword(password);

    const user = await authService.register({
      email,
      password: hashedPassword,
      phone: phone,
      address: address,
      name: name,
    });

    await authService.sendOtp(email);

    res.status(201).json({
      message: "User created. OTP sent to email for verification.",
      user: { id: user.id, email: user.email },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ......................... Forgot Password ...............................
const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await authService.forgotPassword(email);

    res.status(200).json({
      message: "Password reset OTP sent to your email",
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ......................... Reset Password ...............................
const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email, OTP and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    await authService.resetPassword({ email, otp, newPassword });

    res.status(200).json({
      message:
        "Password reset successful. Please login with your new password.",
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// .......................... Login ...............................
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (!userExists) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await authService.comparePassword(
      password,
      userExists.password,
    );
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const user = await authService.login({ email, password });

    res.status(200).json({ success: true, message: "Login successful", user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// .......................... Verify OTP ...............................
const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await authService.verifyOtp(email, otp);

    res.status(200).json({
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// .......................... Resend OTP ...............................
const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await authService.resendOtp(email);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// .......................... Logout ...............................
const logout = async (req: Request, res: Response) => {
  try {
    // Assumption: JWT/token client-side (localStorage ba cookie) e store hoy.
    // Jodi httpOnly cookie use korchen token-er jonno, eikhane clear korte hobe:
    res.clearCookie("token"); // apnar cookie naam onujayi adjust korun, na thakle ei line remove korun

    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const authController = {
  login,
  register,
  verifyOtp,
  logout,
  forgotPassword,
  resetPassword,
  resendOtp,
};

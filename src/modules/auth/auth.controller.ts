import { Request, Response } from "express";
import { authService } from "./auth.service";
import { prisma } from "../../../lib/prisma";

const register = async (req: Request, res: Response) => {
  try {
    const { email, password, phone, address } = req.body;

    const hashedPassword = await authService.hashPassword(password);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const sendOtp = await authService.sendOtp(email);

    const user = await authService.register({
      email,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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

    const user = await authService.login({ email, password });

    res.status(200).json({ message: "Login successful", user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const authController = {
  login,
};

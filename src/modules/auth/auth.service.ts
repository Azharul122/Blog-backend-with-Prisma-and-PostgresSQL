import { prisma } from "../../../lib/prisma";

const register = async (data: {
  email: string;
  password: string;
  phone: string;
  address: string;
}) => {
  const result = await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
    },
  });
  return result;
};

const login = async (data: { email: string; password: string }) => {
  const result = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!result) {
    throw new Error("User not found");
  }

  return result;
};

// ......................... Hash Password ...............................
const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = await import("bcrypt");
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// ......................... Verify Password ...............................
const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const bcrypt = await import("bcrypt");
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

// ......................... Send OTP ...............................
const sendOtp = async (email: string) => {
  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiresAt },
  });

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Your OTP Code",
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });

  return otp;
};

export const authService = {
  register,
  login,
  hashPassword,
  verifyPassword,
};

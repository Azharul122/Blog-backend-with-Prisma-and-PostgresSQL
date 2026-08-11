import { prisma } from "../../../lib/prisma";
import { transporter } from "../../lib/mailer";
import getOtpEmailTemplate from "../../templetes/OtpTemplete";
import generateOtp from "../../utils/generateOtp";



const register = async (data: {
  email: string;
  password: string;
  phone: string | null;
  address: string | null;
  name: string;
}) => {
  const result = await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      phone: data.phone,
      address: data.address,
      name: data.name,
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
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiresAt },
  });

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Your OTP Code",
    html: getOtpEmailTemplate(otp),
  });

  return otp;
};

//  ......................... Verify OTP ...............................

const verifyOtp = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.otp || !user.otpExpiresAt) {
    throw new Error("No OTP requested for this user");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.otpExpiresAt < new Date()) {
    throw new Error("OTP has expired");
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      emailVerified: true,
      otp: null,
      otpExpiresAt: null,
    },
  });

  return updatedUser;
};

const comparePassword = async (password: string, hashedPassword: string) => {
  const bcrypt = await import("bcrypt");
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

// ......................... Resend OTP ...............................
const resendOtp = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.emailVerified) {
    throw new Error("Email is already verified");
  }

  // Simple resend cooldown check (optional but recommended)
  if (
    user.otpExpiresAt &&
    user.otpExpiresAt > new Date(Date.now() - 4 * 60 * 1000)
  ) {
    // Ager OTP still valid mane last 1 min-er modhye pathano hoyeche (5 min expiry - 4 min = 1 min gap)
    const secondsLeft = Math.ceil(
      (user.otpExpiresAt.getTime() - 5 * 60 * 1000 + 60 * 1000 - Date.now()) /
        1000,
    );
    if (secondsLeft > 0) {
      throw new Error(
        `Please wait ${secondsLeft}s before requesting a new OTP`,
      );
    }
  }

  await sendOtp(email); // existing sendOtp function reuse
  return true;
};

// ......................... Forgot Password ...............................
const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Security best practice: email exist na korleo same message dekhano uchit,
    // eta user enumeration attack thamay. Kintu ekhon simplicity-r jonno explicit error dilam.
    throw new Error("No account found with this email");
  }

  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiresAt },
  });

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Password Reset OTP",
    html: `<p>Your password reset OTP is <b>${otp}</b>. It expires in 5 minutes. If you didn't request this, ignore this email.</p>`,
  });

  return true;
};

// ......................... Reset Password ...............................
const resetPassword = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.otp || !user.otpExpiresAt) {
    throw new Error("No OTP requested. Please request a password reset first.");
  }

  if (user.otp !== data.otp) {
    throw new Error("Invalid OTP");
  }

  if (user.otpExpiresAt < new Date()) {
    throw new Error("OTP has expired");
  }

  const hashedPassword = await hashPassword(data.newPassword);

  await prisma.user.update({
    where: { email: data.email },
    data: {
      password: hashedPassword,
      otp: null,
      otpExpiresAt: null,
    },
  });

  return true;
};

export const authService = {
  register,
  login,
  hashPassword,
  verifyPassword,
  sendOtp,
  verifyOtp,
  comparePassword,
  resendOtp,
  forgotPassword,
  resetPassword,
};

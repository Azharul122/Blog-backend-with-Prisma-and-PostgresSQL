import { Request } from "express";
import jwt from "jsonwebtoken";

export const getUserFromToken = (token: string, Request?: Request) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    id: string;
    role: string;
    email: string;
    name: string;
  };
  return decoded;
};

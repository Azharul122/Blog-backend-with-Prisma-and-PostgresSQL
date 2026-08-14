import { NextFunction, Request, Response } from "express";
import { getUserFromToken } from "../utils/getUserFromToken";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: string;
        email: string;
        name: string;
      };
    }
  }
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

const authMiddleware = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = getUserFromToken(req.cookies.token as string, req);

      if (!user) {
        return res.status(401).json({
          message: "User not authenticated",
          success: false,
          code: 401,
        });
      }

      if (UserRole && !roles.includes(user.role as UserRole)) {
        return res.status(403).json({
          message: "You are not authorized to access this resource",
          success: false,
          code: 403,
        });
      }

      next();
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
        success: false,
        code: 400,
      });
      next(error);
    }
  };
};

export default authMiddleware;

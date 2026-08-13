import cookieParser from "cookie-parser";
import express, { Application } from "express";
import { postRouter } from "./modules/posts/post.route";
import { authRouter } from "./modules/auth/auth.route";
import { userRouter } from "./modules/users/user.route";
import { categoryRouter } from "./modules/category/category.route";
import { commentRouter } from "./modules/comments/comments.route";
import { overviewRouter } from "./modules/overview/overview.route";

const app: Application = express();
app.use(cookieParser());
app.use(express.json());

const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/post`, postRouter);
app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/user`, userRouter);
app.use(`${API_PREFIX}/category`, categoryRouter);
app.use(`${API_PREFIX}/comment`, commentRouter);
app.use(`${API_PREFIX}/overview`, overviewRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;

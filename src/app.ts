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

app.use("/post", postRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/comment", commentRouter);
app.use("/overview", overviewRouter);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;

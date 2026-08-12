import cookieParser from "cookie-parser";
import express, { Application } from "express";
import { postRouter } from "./modules/posts/post.route";
import { authRouter } from "./modules/auth/auth.route";
import { userRouter } from "./modules/users/user.route";

const app: Application = express();
app.use(cookieParser());
app.use(express.json());

app.use("/post", postRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;

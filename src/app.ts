import e from "express";
import express, { Application } from "express";
import { postRouter } from "./modules/posts/post.router";
import { authRouter } from "./modules/auth/auth.route";

const app: Application = express();

app.use(express.json());

app.use("/posts", postRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;

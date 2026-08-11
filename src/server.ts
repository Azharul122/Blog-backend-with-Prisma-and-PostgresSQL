import dotenv from "dotenv";

dotenv.config();

import { prisma } from "../lib/prisma";
import app from "./app";
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database");

    app.listen(process.env.PORT, () => {
      console.log(
        `Server is running on port http://localhost:${process.env.PORT}`,
      );
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();

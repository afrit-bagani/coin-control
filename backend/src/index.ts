import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import cors from "cors";

// local import
import { authRouter } from "./routes/auth.route";
import { budgetRouter } from "./routes/budget.route";
import { expenseRouter } from "./routes/expense.route";
import { FRONTEND_URL } from "./config";
import { authenticate } from "./middleware/auth.middleware";

dotenv.config();

const app = express();
export const prisma = new PrismaClient().$extends(withAccelerate());

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use("/auth", authRouter);
app.use("/budgets", authenticate, budgetRouter);
app.use("/expenses", expenseRouter);

(async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to prisma db...");
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to db: \n", error);
  }
})();

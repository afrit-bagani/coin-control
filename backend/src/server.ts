import express from "express";
import cors from "cors";

// local import
import { authRouter } from "./routes/auth.route";
import { budgetRouter } from "./routes/budget.route";
import { expenseRouter } from "./routes/expense.route";
import { authenticate } from "./middleware/auth.middleware";

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.use("/auth", authRouter);
app.use("/budgets", budgetRouter);
app.use("/expenses", expenseRouter);

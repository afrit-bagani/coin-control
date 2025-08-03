import express from "express";
import {
  createExpense,
  deleteExpenseController,
  getExpenseController,
} from "../controllers/expense.controller";

export const expenseRouter = express.Router();

expenseRouter.get("/", getExpenseController);
expenseRouter.post("/", createExpense);
expenseRouter.delete("/", deleteExpenseController);

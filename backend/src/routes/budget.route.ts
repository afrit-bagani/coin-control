import express from "express";
import {
  createBudget,
  getAllBudgetsController,
  deleteBudgetController,
  getSpecificBudget,
} from "../controllers/budget.controller";
import { authenticate } from "../middleware/auth.middleware";

export const budgetRouter = express.Router();

budgetRouter.get("/", getAllBudgetsController);
budgetRouter.get("/:budgetId", getSpecificBudget);
budgetRouter.post("/", createBudget);
budgetRouter.delete("/", deleteBudgetController);

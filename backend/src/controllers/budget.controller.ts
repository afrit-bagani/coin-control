import { Request, Response } from "express";
import { z } from "zod";

// local import
import {
  createBudgetAndFetchAll,
  deleteBudget,
  getAllBudgets,
  getBudgetById,
} from "../db/budget.db";
import { getErrorMessage } from "../utils/error";
import { errorResponse, successResponse } from "../utils/response";

export const getAllBudgetsController = async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(403).json(errorResponse("User id is required"));
  }
  try {
    const allBudgets = await getAllBudgets(userId as string);
    return res.status(200).json(
      successResponse(`All budgets fetched for user id: ${userId}`, {
        budgets: allBudgets,
      })
    );
  } catch (error) {
    console.error(
      `Error happen while fetching budgets for user id: ${userId}\n`,
      error
    );
    return res
      .status(500)
      .json(errorResponse("Internal server error", getErrorMessage(error)));
  }
};

export const createBudget = async (req: Request, res: Response) => {
  const { userId, budgetName, budgetAmount } = req.body;
  const createBudgetSchema = z.object({
    userId: z
      .string()
      .min(1, "User id is missing")
      .max(4, "User id will be max 8 char"),
    budgetName: z
      .string()
      .min(1, "Budget name is missing")
      .max(20, "Budget name will be max 20 char"),
    budgetAmount: z
      .string()
      .min(1, "Budget amount is missing")
      .max(20, "Budget amount will be max 8 char"),
  });

  const parsedData = createBudgetSchema.safeParse(req.body);
  if (!parsedData.success === true) {
    return res
      .status(409)
      .json(errorResponse("Input validation falied", parsedData.error));
  }
  try {
    await createBudgetAndFetchAll({
      userId,
      budgetName,
      budgetAmount,
    });
    return res
      .status(201)
      .json(successResponse(`Budget ${budgetName} created`));
  } catch (error) {
    console.error(`Error while creating budget for user: ${userId} \n`, error);
    return res
      .status(500)
      .json(errorResponse("Internal server errro", getErrorMessage(error)));
  }
};

export const getSpecificBudget = async (req: Request, res: Response) => {
  const { budgetId } = req.params;
  if (!budgetId) {
    return res.status(400).json(errorResponse("Budget id is missing"));
  }
  try {
    const budget = await getBudgetById(budgetId);
    return res
      .status(200)
      .json(
        successResponse(`Budget fetched for id ${budgetId}`, { budget: budget })
      );
  } catch (error) {
    console.error("Error while fetching budget\n", error);
    return res
      .status(500)
      .json(errorResponse("Internal server error", getErrorMessage(error)));
  }
};

export const deleteBudgetController = async (req: Request, res: Response) => {
  const { budgetId } = req.body;
  if (!budgetId) {
    return res.status(400).json(errorResponse("Budget id is required"));
  }
  try {
    await deleteBudget(budgetId as string);
    return res.status(204).json(successResponse("Budget deleted"));
  } catch (error) {
    console.error(`Error while deleting budget for id: ${budgetId}\n`, error);
    return res
      .status(500)
      .json(errorResponse("Internal server error", getErrorMessage(error)));
  }
};

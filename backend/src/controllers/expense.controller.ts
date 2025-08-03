import { Request, Response } from "express";
import z from "zod";

// Local import
import { addExpense, deleteExpense, getExpense } from "../db/expense.db";
import { errorResponse, successResponse } from "../utils/response";
import { getErrorMessage } from "../utils/error";

export const getExpenseController = async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json(errorResponse("User id is required"));
  }
  try {
    const expenses = await getExpense(userId as string);
    return res.status(200).json(
      successResponse(`All expenses fetched for user ${userId}`, {
        expenses: expenses,
      })
    );
  } catch (error) {
    console.error("Error while fetching expenses: \n", error);
    return res
      .status(500)
      .json(errorResponse("Internal server error", getErrorMessage(error)));
  }
};

export const createExpense = async (req: Request, res: Response) => {
  const { budgetId, expenseName, expenseAmount } = req.body;

  const expenseSchema = z.object({
    budgetId: z
      .string()
      .min(1, "Budget id is required")
      .max(4, "Budget id will be max 4 char"),
    expenseName: z
      .string()
      .min(1, "Expense name is required")
      .max(20, "Expenses name can not be longer than 20 char"),
    expenseAmount: z
      .string()
      .min(1, "Expense amount is required")
      .max(1000000, "Expense amount can not bigger than 10,00,000"),
  });
  const parsedData = expenseSchema.safeParse(req.body);
  if (parsedData.success === false) {
    return res
      .status(403)
      .json(errorResponse("Input validation failed", parsedData.error));
  }
  try {
    const expense = await addExpense({ budgetId, expenseName, expenseAmount });
    return res
      .status(201)
      .json(successResponse("Expense created", { expense: expense }));
  } catch (error) {
    console.error("Error while creating expense: \n", error);
    return res
      .status(500)
      .json(errorResponse("Internal server error", getErrorMessage(error)));
  }
};

export const deleteExpenseController = async (req: Request, res: Response) => {
  const { expenseId } = req.body;
  if (!expenseId) {
    return res
      .status(400)
      .json(errorResponse("Budget id is required for delete expense"));
  }

  try {
    await deleteExpense(expenseId as string);
    return res.status(200).json(successResponse("Expense deleted"));
  } catch (error) {
    console.error(`Error while deleting expense for id: ${expenseId}\n`, error);
    return res
      .status(500)
      .json(errorResponse("Internal server error", getErrorMessage(error)));
  }
};

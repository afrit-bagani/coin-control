import { prisma } from "../index";

type AddExpenseType = {
  budgetId: string;
  expenseName: string;
  expenseAmount: string;
};

export const getExpense = async (userId: string) => {
  return prisma.budget.findMany({
    where: { userId: Number(userId) },
    select: { expenses: true },
  });
};

export const addExpense = async ({
  budgetId,
  expenseName,
  expenseAmount,
}: AddExpenseType) => {
  // checking budgetId exist or not
  const budget = await prisma.budget.findUnique({
    where: { id: Number(budgetId) },
    select: { id: true },
  });
  if (!budget) {
    throw new Error(`Budget with ${budgetId} not found`);
  }
  // create the expense
  return prisma.expense.create({
    data: {
      budgetId: Number(budgetId),
      name: expenseName,
      amount: Number(expenseAmount),
    },
  });
};

export const deleteExpense = async (expenseId: string) => {
  const expense = await prisma.expense.findUnique({
    where: { id: Number(expenseId) },
  });
  if (!expense) {
    throw new Error(`Expense not found with id: ${expenseId}`);
  }
  await prisma.expense.delete({
    where: { id: Number(expenseId) },
  });
};

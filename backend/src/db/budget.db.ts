import { prisma } from "../index";

type CreateBudgetType = {
  userId: string;
  budgetName: string;
  budgetAmount: number;
};

export const getBudgetById = async (budgetId: string) => {
  const budget = await prisma.budget.findUnique({
    where: { id: Number(budgetId) },
    include: { expenses: true },
  });
  if (!budget) {
    throw new Error(`Budget not found for id ${budgetId}`);
  }
  const spent = budget.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  return { ...budget, spent };
};

export const getAllBudgets = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: { id: true },
  });
  if (!user) {
    throw new Error(`User don't exist for id: ${userId}`);
  }
  const budgets = await prisma.budget.findMany({
    where: { userId: user.id },
    include: { expenses: true },
  });
  // creating a spent field and add to budget object, spend wil be shownn in UI
  const budgetsWithSpent = budgets.map((budget) => {
    const spent = budget.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    return {
      ...budget,
      spent,
    };
  });
  return budgetsWithSpent;
};

export const createBudgetAndFetchAll = async ({
  userId,
  budgetName,
  budgetAmount,
}: CreateBudgetType) => {
  const [createBudget] = await prisma.$transaction([
    prisma.budget.create({
      data: {
        userId: Number(userId),
        name: budgetName,
        amount: Number(budgetAmount),
      },
    }),
    // prisma.budget.findMany({
    //   where: { userId: Number(userId) },
    //   include: { expenses: true },
    // }),
  ]);
  return createBudget;
};

export const deleteBudget = async (budgetId: string) => {
  const budget = await prisma.budget.findUnique({
    where: { id: Number(budgetId) },
    select: { id: true },
  });
  if (!budget) {
    throw new Error(`Budget not found with id: ${budgetId}`);
  }
  await prisma.budget.delete({
    where: { id: budget.id },
  });
};

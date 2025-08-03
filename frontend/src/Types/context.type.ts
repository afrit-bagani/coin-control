export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export type BudgetType = {
  id: number;
  name: string;
  amount: number;
  spent: number;
  expenses: ExpenseType[];
};

export type ExpenseType = {
  id: number;
  name: string;
  amount: number;
  budgetId: number;
  budgetName: string;
};

export type ContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  budgets: BudgetType[] | null;
  setBudgets: React.Dispatch<React.SetStateAction<BudgetType[] | null>>;
  expenses: ExpenseType[] | null;
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseType[] | null>>;
};

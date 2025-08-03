import { createContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

// Local import
import type {
  ExpenseType,
  BudgetType,
  ContextType,
  User,
} from "../Types/context.type";

type ContextProviderType = {
  children: React.ReactNode;
};

export function getCookie(name: string) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      const str = decodeURIComponent(value);
      return str.split("j:")[1];
    }
  }
  return undefined;
}

export const Context = createContext({} as ContextType);
export default function ContextProvider({ children }: ContextProviderType) {
  // user
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user") || getCookie("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString == null) {
      const user = getCookie("user");
      if (user !== undefined) {
        localStorage.setItem("user", user);
      }
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("User logout successfully");
  };

  // budgets and expenses
  const [budgets, setBudgets] = useState<BudgetType[] | null>(null);
  const [expenses, setExpenses] = useState<ExpenseType[] | null>(null);

  useEffect(() => {
    if (budgets === null) {
      setBudgets(null);
      return;
    }

    const allExpense = budgets.flatMap((budget) =>
      budget.expenses.map((expense) => ({
        ...expense,
        budgetName: budget.name,
      }))
    );
    setExpenses(allExpense);
  }, [budgets]);

  const contextValue = useMemo<ContextType>(
    () => ({
      user,
      setUser,
      logout,
      budgets,
      setBudgets,
      expenses,
      setExpenses,
    }),
    [user, budgets, expenses]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

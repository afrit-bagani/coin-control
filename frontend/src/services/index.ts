import { BACKEND_URL } from "../config";
import { getCookie } from "../context/ContextProvider";
import type { BudgetType, User } from "../Types/context.type";

type FetcheBudgetType =
  | {
      budgets: BudgetType[];
    }
  | undefined;

/**
 *  Fetch all budgets of a user
 */
export const fetchBudgets = async (): Promise<FetcheBudgetType> => {
  const userString = localStorage.getItem("user") || getCookie("user");
  if (userString == null && userString == undefined) {
    console.error("User not found");
    return;
  }
  const user: User = JSON.parse(userString);
  try {
    const res = await fetch(`${BACKEND_URL}/budgets?userId=${user.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    return data.data.budgets;
  } catch (error) {
    console.error("Error happen while fetching budgets: \n", error);
  }
};

import { useContext, useEffect } from "react";
import { redirect, useLoaderData } from "react-router-dom";

// local import
import { Context, getCookie } from "../context/ContextProvider";
import { BACKEND_URL } from "../config";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import { fetchBudgets } from "../services";
import type { HomeLoaderType } from "../Types/home.type";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";
import { toast } from "react-toastify";

export const homeLoader = async () => {
  const user = localStorage.getItem("user") || getCookie("user");
  if (!user) return redirect("/signin");
  const budgetsData = await fetchBudgets();
  return { budgetsData };
};

export const homeAction = async ({ request }: { request: Request }) => {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  // Create Budget
  if (_action === "createBudget") {
    try {
      const res = await fetch(`${BACKEND_URL}/budgets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message);
        throw new Error(data.error);
      }
      toast.success(data.message);
    } catch (error) {
      console.error("Error happen while creating budget: \n", error);
    }
  }
  // create Expense
  else if (_action === "createExpense") {
    try {
      const res: Response = await fetch(`${BACKEND_URL}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message);
        throw new Error(data.error);
      }
      toast.success(data.message);
    } catch (error) {
      console.error("Error while creating expenses: \n", error);
    }
  }
  // Delete Expense
  else if (_action === "deleteExpense") {
    try {
      const res = await fetch(`${BACKEND_URL}/expenses/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message);
        throw new Error(data.error);
      }
      toast.success(data.message);
    } catch (error) {
      console.error("Error while deleteing expense: \n", error);
    }
  }
  // Delete Budget
  else if (_action === "deleteBudget") {
    try {
      const res = await fetch(`${BACKEND_URL}/budgets`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message);
        throw new Error(data.error);
      }
      toast.success(data.message);
    } catch (error) {
      console.error("Error while deleteing budget: \n", error);
    }
  } else {
    throw new Error("Unknown Action");
  }
};

export default function Home() {
  const { user, budgets, setBudgets, expenses } = useContext(Context);
  const { budgetsData }: HomeLoaderType = useLoaderData();
  if (!budgetsData) return;

  // prevent side effect: update budgets after home render
  useEffect(() => {
    if (budgetsData) {
      setBudgets(budgetsData);
    }
  }, [budgetsData]);
  return (
    <>
      <div className="min-h-screen bg-gray-100 space-y-4">
        <h1 className="mt-2 text-orange-500 text-3xl md:text-5xl font-bold">
          Welcome, {user?.name || "User"}
        </h1>

        {budgets && budgets.length > 0 ? (
          <>
            <div className="flex flex-col md:flex-row md:justify-around ">
              <AddBudgetForm />
              <AddExpenseForm budgets={budgets} />
            </div>
            <h2 className="text-blue-500 text-3xl md:text-5xl font-medium">
              Existing Budgets
            </h2>
            {/* Rendering individual budget item */}
            <div className="flex flex-wrap">
              {budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="px-4 mb-8 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"
                >
                  <BudgetItem budget={budget} />
                </div>
              ))}
            </div>
            {expenses !== null && expenses.length > 0 && (
              <Table expenses={expenses} />
            )}
          </>
        ) : (
          <div className="w-full">
            <p className="text-purple-500 text-3xl md:text-4xl font-medium w-full">
              Personal Budgeting Is The Secrect To Financial Freedom. Start Your
              Journey Today.
            </p>
            <p>Create a budget to get started</p>
            <AddBudgetForm />
          </div>
        )}
      </div>
    </>
  );
}

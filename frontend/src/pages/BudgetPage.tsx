import { toast } from "react-toastify";
import { redirect, useLoaderData, type Params } from "react-router-dom";

// Local import
import { BACKEND_URL } from "../config";
import type { BudgetType } from "../Types/context.type";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";

export const budgetLoader = async ({ params }: { params: Params }) => {
  const { id } = params;
  try {
    const res = await fetch(`${BACKEND_URL}/budgets/${id}`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      return redirect("/home");
    }
    return { budget: data.data.budget };
  } catch (error) {
    console.error("Error while fetching budget in BudgetPage: \n", error);
  }
};

export const budgetAction = async ({ request }: { request: Request }) => {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  // Create Expense
  if (_action === "createExpense") {
    try {
      const res = await fetch(`${BACKEND_URL}/expenses`, {
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
      console.error("Error while creating expense in BudgetPage: \n", error);
    }
  }
  // Delete Budget
  else if (_action === "deleteBudget") {
    try {
      const res = await fetch(`${BACKEND_URL}/budgets`, {
        method: "DElETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return toast.error(data.message);
      }
      return toast.success(data.message);
    } catch (error) {
      console.error("Error while deleting budget: \n", error);
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
        return toast.error(data.message);
      }
      return toast.success(data.message);
    } catch (error) {
      console.error("Error while deleteing expense: \n", error);
    }
  } else {
    throw new Error("Unknown Action");
  }
};

export default function BudgetPage() {
  const { budget }: { budget: BudgetType } = useLoaderData();

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1">
          <BudgetItem budget={budget} showBudget={true} />
        </div>
        <div className="flex-1">
          <AddExpenseForm budgets={[budget]} />
        </div>
      </div>
      {budget.expenses.length > 0 && <Table expenses={budget.expenses} />}
    </div>
  );
}

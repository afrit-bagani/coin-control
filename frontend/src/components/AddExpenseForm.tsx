import { useFetcher } from "react-router-dom";

// Local import
import type { BudgetType } from "../Types/context.type";

export default function AddExpenseForm({ budgets }: { budgets: BudgetType[] }) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  if (!budgets || budgets === null) return null;
  const onlyOneBudget = budgets.length === 1;

  return (
    <div className="mt-4 p-6 w-full max-w-md space-y-6 bg-white border-3 border-black rounded-2xl shadow-2xl">
      <h1 className="text-violet-700 text-2xl md:text-3xl  bg-sky-300 rounded-md shadow-2xl text-center py-1.5 font-semibold">
        Create Expense
      </h1>
      <fetcher.Form method="post" className="space-y-4">
        <input type="hidden" name="_action" value="createExpense" />
        <div className="text-gray-700 text-sm md:text-lg font-medium">
          <label htmlFor="expense-name">Expense Name</label>
          <input
            type="text"
            id="expense-name"
            name="expenseName"
            placeholder="Enter expense name"
            required
            title="Expense Name"
            className="mt-1 w-full px-3 py-2 rounded-lg shadow-sm border-1 hover:bg-violet-100 focus:bg-violet-200"
          />
        </div>
        <div className="text-gray-700 text-sm md:text-lg font-medium">
          <label htmlFor="expense-amount">Expense Amount</label>
          <input
            type="number"
            id="expense-amount"
            name="expenseAmount"
            placeholder="Enter expense amount"
            required
            title="expense Amount"
            className="mt-1 w-full px-3 py-2 rounded-lg shadow-sm border-1 hover:bg-violet-100 focus:bg-violet-200"
          />
        </div>
        {onlyOneBudget ? (
          <input type="hidden" name="budgetId" value={budgets[0].id} />
        ) : (
          <div className="text-gray-700 text-sm md:text-lg font-medium">
            <label htmlFor="budget-catagory">Catagory</label>
            <select
              id="budget-category"
              name="budgetId"
              defaultValue="" // ensures placeholder stays selected initially
              required
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
            >
              {/* Placeholder option (hidden once a valid budget is picked) */}
              <option value="" disabled hidden>
                Select a budget…
              </option>

              {/* Your budgets */}
              {budgets.map((budget) => (
                <option
                  key={budget.id}
                  value={budget.id}
                  className="text-gray-900"
                >
                  {budget.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          type="submit"
          className="w-full px-3 py-2 text-violet-700 font-medium border-2 border-violet-600 rounded-2xl bg-violet-200 hover:bg-violet-300 disabled:opacity-40"
          disabled={isSubmitting}
        >
          {!isSubmitting ? "Create Expense" : "Creating..."}
        </button>
      </fetcher.Form>
    </div>
  );
}

import { useContext } from "react";
import { useFetcher } from "react-router-dom";

// local import
import { Context } from "../context/ContextProvider";

export default function AddBudgetForm() {
  const { user } = useContext(Context);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <div className="mt-4 p-6 w-full max-w-md space-y-6 bg-white border-3 border-black rounded-2xl shadow-2xl">
      <h1 className="text-violet-900 text-2xl md:text-3xl bg-sky-200 rounded-md shadow-2xl text-center py-2 font-semibold">
        Create Budget
      </h1>
      <fetcher.Form method="post" className="space-y-4">
        <input type="hidden" name="_action" value="createBudget" />
        <input type="hidden" name="userId" value={user?.id} />
        <div className="text-gray-700 text-sm md:text-lg font-medium">
          <label htmlFor="budget-name">Budget Name</label>
          <input
            type="text"
            id="budget-name"
            name="budgetName"
            placeholder="e.g groceries"
            required
            title="Budget Name"
            className="mt-1 w-full px-3 py-2 rounded-lg shadow-sm border-1 hover:bg-violet-100 focus:bg-violet-200"
          />
        </div>
        <div className="text-gray-700 text-sm md:text-lg font-medium">
          <label htmlFor="budget-amount">Budget Amount</label>
          <input
            type="number"
            id="budget-amount"
            name="budgetAmount"
            placeholder="₹ 15,000"
            required
            title="Budget Amount"
            className="mt-1 w-full px-3 py-2 rounded-lg shadow-sm border-1 hover:bg-violet-100 focus:bg-violet-200"
          />
        </div>
        <button
          type="submit"
          className="w-full px-3 py-2 text-violet-700 font-medium border-2 border-violet-600 rounded-2xl bg-violet-200 hover:bg-violet-300 disabled:opacity-40"
          disabled={isSubmitting}
        >
          {!isSubmitting ? "Create Budget" : "Creating..."}
        </button>
      </fetcher.Form>
    </div>
  );
}

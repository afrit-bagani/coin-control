import { Form, Link } from "react-router-dom";
import type { BudgetType } from "../Types/context.type";

interface BudgetItemProps {
  budget: BudgetType;
  showBudget?: boolean;
}

export default function BudgetItem({
  budget,
  showBudget = false,
}: BudgetItemProps) {
  const { id, name, amount, spent } = budget;
  const percentage = amount > 0 ? (spent / amount) * 100 : 0;

  return (
    <div className="max-w-sm w-full bg-white rounded-2xl shadow-md p-6 border border-amber-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-amber-700">{name}</h3>
        <span className="text-sm text-gray-500">
          ₹{spent} / ₹{amount}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-amber-100 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-amber-400 transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-right text-sm text-amber-600 mt-1 font-medium">
          {percentage.toFixed(1)}%
        </p>
      </div>

      {/* Action Buttons */}
      <div
        className={`mt-4 flex items-center ${
          showBudget ? "justify-center" : "justify-between"
        }`}
      >
        {!showBudget && (
          <Link
            to={`/budgets/${id}`}
            className="px-3 py-2 text-sm text-cyan-600 border border-cyan-500 font-medium rounded-md bg-cyan-100 hover:bg-cyan-200 transition"
            aria-label={`View details for ${name}`}
          >
            View Details
          </Link>
        )}

        <Form method="post" className={showBudget ? "w-full" : ""}>
          <input type="hidden" name="_action" value="deleteBudget" />
          <input type="hidden" name="budgetId" value={id} />
          <button
            type="submit"
            aria-label={`Delete budget ${name}`}
            className={`px-3 py-2 text-sm text-red-600 border border-red-500 font-medium rounded-md bg-red-100 hover:bg-red-200 transition ${
              showBudget ? "w-full" : ""
            }`}
          >
            Delete
          </button>
        </Form>
      </div>
    </div>
  );
}

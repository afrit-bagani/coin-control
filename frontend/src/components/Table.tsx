import { Form } from "react-router-dom";
import type { ExpenseType } from "../Types/context.type";
import { DeleteButton } from "./ui/DeleteButton";

export default function Table({ expenses }: { expenses: ExpenseType[] }) {
  const tableHeading = ["Expense", "Budget Catagoty", "Amount", ""];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-md shadow-md">
        <caption className="text-lg font-semibold text-gray-700 my-4">
          Expenses Details
        </caption>
        <thead className="bg-amber-100 text-gray-800">
          <tr>
            {tableHeading.map((heading, index) => (
              <th
                key={index}
                className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr
              key={expense.id}
              className="hover:bg-amber-50 transition-colors duration-200"
            >
              <td className="px-4 py-2 border-b border-gray-200">
                {expense.name}
              </td>
              <td className="px-4 py-2 border-b border-gray-200">
                {expense.budgetName}
              </td>
              <td className="px-4 py-2 border-b border-gray-200">
                ₹{expense.amount}
              </td>
              <td>
                <Form method="post">
                  <input type="hidden" name="_action" value="deleteExpense" />
                  <input type="hidden" name="expenseId" value={expense.id} />
                  <button>
                    <DeleteButton className="text-red-500" />
                  </button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

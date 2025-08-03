export type AddBudgetType =
  | {
      success: true;
      message: string;
      _action:
        | "createBudget"
        | "createExpense"
        | "deleteBudget"
        | "deleteExpense";
    }
  | {
      success: false;
      error: string | { message: string };
    };

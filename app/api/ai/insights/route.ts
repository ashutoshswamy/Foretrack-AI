import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  generateFinancialInsights,
  type ExpenseData,
  type BudgetData,
} from "@/lib/gemini";

// Input validation constants
const MAX_EXPENSES_COUNT = 500;
const MAX_BUDGETS_COUNT = 50;

function validateExpenseData(expense: unknown): expense is ExpenseData {
  if (!expense || typeof expense !== "object") return false;
  const e = expense as Record<string, unknown>;
  return (
    typeof e.category === "string" &&
    typeof e.amount === "number" &&
    !isNaN(e.amount) &&
    e.amount >= 0 &&
    typeof e.date === "string"
  );
}

function validateBudgetData(budget: unknown): budget is BudgetData {
  if (!budget || typeof budget !== "object") return false;
  const b = budget as Record<string, unknown>;
  return (
    typeof b.category === "string" &&
    typeof b.amount === "number" &&
    !isNaN(b.amount) &&
    b.amount >= 0 &&
    typeof b.spent === "number" &&
    !isNaN(b.spent) &&
    typeof b.percentage === "number"
  );
}

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { expenses, budgets, totalSpent } = body as {
      expenses: ExpenseData[];
      budgets: BudgetData[];
      totalSpent: number;
    };

    // Validate expenses array
    if (!Array.isArray(expenses)) {
      return NextResponse.json(
        { error: "Expenses must be an array" },
        { status: 400 },
      );
    }

    if (expenses.length > MAX_EXPENSES_COUNT) {
      return NextResponse.json(
        { error: `Too many expenses. Maximum allowed: ${MAX_EXPENSES_COUNT}` },
        { status: 400 },
      );
    }

    // Validate each expense
    const validatedExpenses = expenses.filter(validateExpenseData);

    // Validate budgets array
    if (!Array.isArray(budgets)) {
      return NextResponse.json(
        { error: "Budgets must be an array" },
        { status: 400 },
      );
    }

    if (budgets.length > MAX_BUDGETS_COUNT) {
      return NextResponse.json(
        { error: `Too many budgets. Maximum allowed: ${MAX_BUDGETS_COUNT}` },
        { status: 400 },
      );
    }

    // Validate each budget
    const validatedBudgets = budgets.filter(validateBudgetData);

    // Validate totalSpent
    const validatedTotalSpent =
      typeof totalSpent === "number" && !isNaN(totalSpent)
        ? Math.max(0, totalSpent)
        : 0;

    const insights = await generateFinancialInsights(
      validatedExpenses,
      validatedBudgets,
      validatedTotalSpent,
    );

    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 },
    );
  }
}

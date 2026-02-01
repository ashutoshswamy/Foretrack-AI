import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { chatWithAI, type ExpenseData, type BudgetData } from "@/lib/gemini";

// Input validation constants
const MAX_MESSAGE_LENGTH = 1000;
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
    const { message, context } = body as {
      message: string;
      context: {
        expenses: ExpenseData[];
        budgets: BudgetData[];
        totalSpent: number;
      };
    };

    // Validate message
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 },
      );
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 },
      );
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be less than ${MAX_MESSAGE_LENGTH} characters` },
        { status: 400 },
      );
    }

    // Validate context
    if (!context || typeof context !== "object") {
      return NextResponse.json(
        { error: "Context is required" },
        { status: 400 },
      );
    }

    // Validate expenses array
    if (!Array.isArray(context.expenses)) {
      return NextResponse.json(
        { error: "Expenses must be an array" },
        { status: 400 },
      );
    }

    if (context.expenses.length > MAX_EXPENSES_COUNT) {
      return NextResponse.json(
        { error: `Too many expenses. Maximum allowed: ${MAX_EXPENSES_COUNT}` },
        { status: 400 },
      );
    }

    // Validate each expense
    const validatedExpenses = context.expenses.filter(validateExpenseData);

    // Validate budgets array
    if (!Array.isArray(context.budgets)) {
      return NextResponse.json(
        { error: "Budgets must be an array" },
        { status: 400 },
      );
    }

    if (context.budgets.length > MAX_BUDGETS_COUNT) {
      return NextResponse.json(
        { error: `Too many budgets. Maximum allowed: ${MAX_BUDGETS_COUNT}` },
        { status: 400 },
      );
    }

    // Validate each budget
    const validatedBudgets = context.budgets.filter(validateBudgetData);

    // Validate totalSpent
    const totalSpent =
      typeof context.totalSpent === "number" && !isNaN(context.totalSpent)
        ? Math.max(0, context.totalSpent)
        : 0;

    // Sanitize message
    const sanitizedMessage = trimmedMessage
      .replace(/[<>]/g, "")
      .substring(0, MAX_MESSAGE_LENGTH);

    const response = await chatWithAI(sanitizedMessage, {
      expenses: validatedExpenses,
      budgets: validatedBudgets,
      totalSpent,
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in AI chat:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 },
    );
  }
}

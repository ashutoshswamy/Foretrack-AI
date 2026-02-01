import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY!;

export const genAI = new GoogleGenAI({ apiKey });

export const model = "gemini-3-flash-preview";

export type ExpenseData = {
  category: string;
  amount: number;
  description?: string;
  date: string;
};

export type BudgetData = {
  category: string;
  amount: number;
  spent: number;
  percentage: number;
};

export type FinancialInsight = {
  type: "tip" | "warning" | "achievement" | "suggestion";
  title: string;
  message: string;
  icon: string;
};

export async function generateFinancialInsights(
  expenses: ExpenseData[],
  budgets: BudgetData[],
  totalSpent: number,
): Promise<FinancialInsight[]> {
  const prompt = `You are a helpful financial advisor AI. Analyze the following financial data and provide 2-3 personalized insights.

Expenses this month:
${JSON.stringify(expenses, null, 2)}

Budget status:
${JSON.stringify(budgets, null, 2)}

Total spent this month: $${totalSpent.toFixed(2)}

Provide insights in the following JSON format (return ONLY the JSON array, no markdown):
[
  {
    "type": "tip" | "warning" | "achievement" | "suggestion",
    "title": "Short title (3-5 words)",
    "message": "Detailed insight (1-2 sentences)",
    "icon": "emoji that represents this insight"
  }
]

Guidelines:
- "warning" for categories near or over budget
- "achievement" for good spending habits or staying under budget
- "tip" for general financial advice based on spending patterns
- "suggestion" for specific actionable recommendations
- Keep messages concise and actionable
- Be encouraging but honest`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
    });

    const text = response.text || "";
    // Clean up the response - remove markdown code blocks if present
    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const insights: FinancialInsight[] = JSON.parse(cleanedText);
    return insights;
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      {
        type: "tip",
        title: "Track Your Spending",
        message:
          "Keep logging your expenses to get personalized AI insights about your spending habits.",
        icon: "💡",
      },
    ];
  }
}

export async function generateSpendingAnalysis(
  expenses: ExpenseData[],
  budgets: BudgetData[],
): Promise<string> {
  const prompt = `You are a friendly financial advisor. Provide a brief, conversational analysis of this spending data.

Expenses this month:
${JSON.stringify(expenses, null, 2)}

Budget status:
${JSON.stringify(budgets, null, 2)}

Write a 2-3 sentence summary that:
1. Highlights the main spending pattern
2. Gives one actionable tip
3. Uses a warm, encouraging tone

Keep it under 100 words. No bullet points or lists - just natural conversation.`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
    });

    return (
      response.text ||
      "Keep tracking your expenses to unlock personalized insights!"
    );
  } catch (error) {
    console.error("Error generating analysis:", error);
    return "Keep tracking your expenses to unlock personalized insights!";
  }
}

export async function categorizeExpense(description: string): Promise<string> {
  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Shopping",
    "Bills",
    "Health",
    "Other",
  ];

  const prompt = `Categorize this expense description into one of these categories: ${categories.join(", ")}

Expense description: "${description}"

Return ONLY the category name, nothing else.`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
    });

    const category = response.text?.trim() || "Other";
    return categories.includes(category) ? category : "Other";
  } catch (error) {
    console.error("Error categorizing expense:", error);
    return "Other";
  }
}

export async function generateSavingsTips(
  topCategories: { category: string; amount: number }[],
): Promise<string[]> {
  const prompt = `Based on these top spending categories, provide 3 specific, actionable tips to save money:

Top spending categories:
${topCategories.map((c) => `- ${c.category}: $${c.amount.toFixed(2)}`).join("\n")}

Return ONLY a JSON array of 3 tip strings (no markdown):
["tip 1", "tip 2", "tip 3"]

Make tips specific to the categories shown, practical, and encouraging.`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
    });

    const text = response.text || "";
    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating savings tips:", error);
    return [
      "Set a weekly spending limit for your top categories",
      "Look for discounts and deals before making purchases",
      "Review your subscriptions and cancel unused ones",
    ];
  }
}

export async function chatWithAI(
  message: string,
  context: {
    expenses: ExpenseData[];
    budgets: BudgetData[];
    totalSpent: number;
  },
): Promise<string> {
  const prompt = `You are Foretrack AI, a friendly and helpful personal finance assistant. The user is asking about their finances.

User's financial context:
- Total spent this month: $${context.totalSpent.toFixed(2)}
- Recent expenses: ${JSON.stringify(context.expenses.slice(0, 5))}
- Budget status: ${JSON.stringify(context.budgets)}

User's question: "${message}"

Provide a helpful, concise response (2-4 sentences). Be friendly, use emojis sparingly, and give specific advice when possible. If the question isn't about finances, politely redirect to financial topics.`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
    });

    return (
      response.text ||
      "I'm here to help with your finances! Try asking about your spending patterns or budget tips."
    );
  } catch (error) {
    console.error("Error in AI chat:", error);
    return "I'm having trouble processing that right now. Please try again!";
  }
}

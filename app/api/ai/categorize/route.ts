import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { categorizeExpense } from "@/lib/gemini";

// Input validation constants
const MAX_DESCRIPTION_LENGTH = 500;
const MIN_DESCRIPTION_LENGTH = 1;

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { description } = body as { description: string };

    // Input validation
    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required and must be a string" },
        { status: 400 },
      );
    }

    const trimmedDescription = description.trim();

    if (trimmedDescription.length < MIN_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        { error: "Description cannot be empty" },
        { status: 400 },
      );
    }

    if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        {
          error: `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`,
        },
        { status: 400 },
      );
    }

    // Sanitize input - remove potential injection patterns
    const sanitizedDescription = trimmedDescription
      .replace(/[<>]/g, "") // Remove HTML tags
      .substring(0, MAX_DESCRIPTION_LENGTH);

    const category = await categorizeExpense(sanitizedDescription);

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error categorizing expense:", error);
    return NextResponse.json(
      { error: "Failed to categorize expense" },
      { status: 500 },
    );
  }
}

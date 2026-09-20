import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { withAuth } from "@/lib/session";

export async function GET(request: NextRequest) {
  return withAuth(async (uid) => {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period");
    const activeOnly = searchParams.get("active") === "true";

    const rows = period
      ? await sql`SELECT * FROM budgets WHERE user_id = ${uid} AND period = ${period}`
      : activeOnly
      ? await sql`SELECT * FROM budgets WHERE user_id = ${uid} AND is_active = true`
      : await sql`SELECT * FROM budgets WHERE user_id = ${uid}`;

    return NextResponse.json(rows);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (uid) => {
    const { category, amount, period } = await request.json();

    try {
      const [row] = await sql`
        INSERT INTO budgets (user_id, category, amount, period)
        VALUES (${uid}, ${category}, ${amount}, ${period})
        RETURNING *
      `;
      return NextResponse.json(row, { status: 201 });
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "23505") {
        return NextResponse.json(
          { error: "A budget for this category and period already exists", code },
          { status: 409 }
        );
      }
      throw err;
    }
  });
}

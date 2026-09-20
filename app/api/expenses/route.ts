import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { withAuth } from "@/lib/session";

export async function GET(request: NextRequest) {
  return withAuth(async (uid) => {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const limit = searchParams.get("limit");

    const rows = from
      ? await sql`SELECT * FROM expenses WHERE user_id = ${uid} AND date >= ${from} ORDER BY date DESC`
      : limit
      ? await sql`SELECT * FROM expenses WHERE user_id = ${uid} ORDER BY date DESC LIMIT ${Number(limit)}`
      : await sql`SELECT * FROM expenses WHERE user_id = ${uid} ORDER BY date DESC`;

    return NextResponse.json(rows);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (uid) => {
    const { amount, category, description, date } = await request.json();

    const [row] = await sql`
      INSERT INTO expenses (user_id, amount, category, description, date)
      VALUES (${uid}, ${amount}, ${category}, ${description}, ${date})
      RETURNING *
    `;

    return NextResponse.json(row, { status: 201 });
  });
}

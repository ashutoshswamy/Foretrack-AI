import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { withAuth } from "@/lib/session";

export async function GET() {
  return withAuth(async (uid) => {
    const [row] = await sql`SELECT currency FROM user_settings WHERE user_id = ${uid}`;
    return NextResponse.json(row ?? null);
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(async (uid) => {
    const { currency } = await request.json();

    const [row] = await sql`
      INSERT INTO user_settings (user_id, currency)
      VALUES (${uid}, ${currency})
      ON CONFLICT (user_id) DO UPDATE SET currency = ${currency}, updated_at = NOW()
      RETURNING currency
    `;

    return NextResponse.json(row);
  });
}

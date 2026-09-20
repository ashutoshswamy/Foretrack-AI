import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { withAuth } from "@/lib/session";

export async function GET() {
  return withAuth(async (uid) => {
    const rows = await sql`SELECT * FROM categories WHERE user_id = ${uid} ORDER BY name`;
    return NextResponse.json(rows);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (uid) => {
    const { name, icon, color } = await request.json();

    try {
      const [row] = await sql`
        INSERT INTO categories (user_id, name, icon, color)
        VALUES (${uid}, ${name}, ${icon}, ${color})
        RETURNING *
      `;
      return NextResponse.json(row, { status: 201 });
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "23505") {
        return NextResponse.json(
          { error: "A category with this name already exists", code },
          { status: 409 }
        );
      }
      throw err;
    }
  });
}

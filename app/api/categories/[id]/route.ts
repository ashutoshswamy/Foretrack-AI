import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { withAuth } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  return withAuth(async (uid) => {
    const { id } = await params;
    const { name, icon, color } = await request.json();

    try {
      const [row] = await sql`
        UPDATE categories
        SET name = ${name}, icon = ${icon}, color = ${color}, updated_at = NOW()
        WHERE id = ${id} AND user_id = ${uid}
        RETURNING *
      `;
      if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(row);
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

export async function DELETE(_request: NextRequest, { params }: Params) {
  return withAuth(async (uid) => {
    const { id } = await params;
    await sql`DELETE FROM categories WHERE id = ${id} AND user_id = ${uid}`;
    return NextResponse.json({ ok: true });
  });
}

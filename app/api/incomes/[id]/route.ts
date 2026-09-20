import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { withAuth } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  return withAuth(async (uid) => {
    const { id } = await params;
    const { amount, source, description, date } = await request.json();

    const [row] = await sql`
      UPDATE incomes
      SET amount = ${amount}, source = ${source}, description = ${description},
          date = ${date}, updated_at = NOW()
      WHERE id = ${id} AND user_id = ${uid}
      RETURNING *
    `;

    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  return withAuth(async (uid) => {
    const { id } = await params;
    await sql`DELETE FROM incomes WHERE id = ${id} AND user_id = ${uid}`;
    return NextResponse.json({ ok: true });
  });
}

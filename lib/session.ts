import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";
import { SESSION_COOKIE } from "./session-cookie";

export { SESSION_COOKIE };

/** Verifies the session cookie. Returns the Firebase uid, or null if missing/invalid. */
export async function getUid(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decoded.uid;
  } catch {
    return null;
  }
}

/** Verifies the session cookie, then runs `handler(uid)`. Returns 401 if unauthenticated. */
export async function withAuth(
  handler: (uid: string) => Promise<NextResponse>
): Promise<NextResponse> {
  const uid = await getUid();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return handler(uid);
}

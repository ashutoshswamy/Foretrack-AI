// Edge-safe constant, deliberately isolated from lib/session.ts (which pulls
// in firebase-admin — a Node-only SDK that can't run in Edge middleware).
export const SESSION_COOKIE = "session";

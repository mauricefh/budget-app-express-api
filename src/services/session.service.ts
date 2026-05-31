import { randomBytes } from "node:crypto";
import { db } from "../lib/db/database";
import { Session } from "../types/session";

export function createSession(userId: number): string {
  const token = randomBytes(32).toString("hex");
  const expire_at = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  db.prepare(
    "INSERT INTO users_sessions (token, expire_at, user_id) VALUES (?, ?, ?)",
  ).run(token, expire_at, userId);

  return token;
}

export function getSession(token: string): Session | null {
  const query = db.prepare(
    "SELECT id, token, expire_at, user_id FROM users_sessions WHERE token = ? AND expire_at > datetime('now')",
  );
  const session = query.get(token) as Session | null;
  return session;
}

export function deleteSession(token: string): void {
  db.prepare("DELETE FROM users_sessions WHERE token = ?").run(token);
}

import { scrypt, randomBytes } from "node:crypto";
import { db } from "../lib/db/database";
import { error } from "node:console";
import { RunResult } from "better-sqlite3";

type User = {
  id: number;
  email: string;
};

export async function hashPassword(
  password: string,
): Promise<{ hash: string; salt: string }> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString("hex");
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve({ hash: derivedKey.toString("hex"), salt: salt });
    });
  });
}

export function findUserByEmail(email: string): User | null {
  const query = db.prepare("SELECT id, email FROM users WHERE email = ?");
  return query.get(email) as User | null;
}

export function createUser(
  email: string,
  hashedPassword: string,
  salt: string,
): number {
  const query = db.prepare(
    "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)",
  );
  const result = query.run(email, hashedPassword, salt);
  return Number(result.lastInsertRowid);
}

import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { db } from "../lib/db/database";
import { User, UserWithCredentials } from "../types/user";

export function findUserByEmail(email: string): User | null {
  const query = db.prepare("SELECT id, email FROM users WHERE email = ?");
  return query.get(email) as User | null;
}

export function findUserByEmailWithCredentials(
  email: string,
): UserWithCredentials | null {
  const query = db.prepare(
    "SELECT id, email, password, salt FROM users WHERE email = ?",
  );
  return query.get(email) as UserWithCredentials | null;
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

export async function verifyPassword(
  password: string,
  salt: string,
  storedHash: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      const derivedKeyHexBuffer = Buffer.from(derivedKey.toString("hex"));
      const storedHashBuffer = Buffer.from(storedHash);
      resolve(timingSafeEqual(derivedKeyHexBuffer, storedHashBuffer));
    });
  });
}

import { db } from "../lib/db/database";
import { Account, CreateAccount } from "../types/account";

export function getAccounts(userId: number): Account[] {
  const query = db.prepare("SELECT * FROM accounts WHERE user_id = ?");
  return query.all(userId) as Account[];
}

export function createAccount(account: CreateAccount): number {
  const query = db.prepare(
    "INSERT INTO accounts (name, type,user_id) VALUES (?, ?, ?)",
  );
  const result = query.run(account.name, account.type, account.user_id);
  return Number(result.lastInsertRowid);
}

export function deleteAccount(id: number, userId: number): void {
  db.prepare("DELETE FROM accounts WHERE id = ? AND user_id = ?").run(
    id,
    userId,
  );
}

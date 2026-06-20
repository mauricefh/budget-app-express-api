import cache from "@/lib/cache";
import { db } from "../lib/db/database";
import { Account, CreateAccount, UpdateAccount } from "../types/account";

export function getAccounts(userId: number): Account[] {
  const cacheKey = `accounts_${userId}`;
  const cachedAccounts = cache.get<Account[]>(cacheKey);
  if (cachedAccounts) return cachedAccounts;
  const query = db.prepare("SELECT * FROM accounts WHERE user_id = ?");
  const accounts = query.all(userId) as Account[];
  cache.set(cacheKey, accounts);
  return accounts;
}

export function createAccount(account: CreateAccount): number {
  const cacheKey = `accounts_${account.user_id}`;
  cache.del(cacheKey);
  const query = db.prepare(
    "INSERT INTO accounts (name, type,user_id) VALUES (?, ?, ?)",
  );
  const newAccount = query.run(account.name, account.type, account.user_id);
  return Number(newAccount.lastInsertRowid);
}

export function updateAccount(id: number, account: UpdateAccount): number {
  const cacheKey = `accounts_${account.user_id}`;
  cache.del(cacheKey);
  const query = db.prepare(
    "UPDATE accounts SET name = ?, type = ? WHERE id = ? AND user_id = ?",
  );
  const updatedAccount = query.run(
    account.name,
    account.type,
    id,
    account.user_id,
  );
  return Number(updatedAccount.changes);
}

export function deleteAccount(id: number, userId: number): void {
  const cacheKey = `accounts_${userId}`;
  cache.del(cacheKey);
  const query = db.prepare("DELETE FROM accounts WHERE id = ? AND user_id = ?");
  query.run(id, userId);
}

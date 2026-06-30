import cache from "@/lib/cache";
import { db } from "../lib/db/database";
import { Account, CreateAccount, UpdateAccount } from "../types/account";
import { invalidateAccountCache } from "utils/cache.utils";

export function getAccounts(userId: number): Account[] {
  const cacheKey = `accounts_${userId}`;
  const cachedAccounts = cache.get<Account[]>(cacheKey);
  if (cachedAccounts) return cachedAccounts;
  const query = db.prepare(`SELECT 
  a.*,
  COALESCE((
    SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) -
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)
    FROM transactions 
    WHERE account_id = a.id
  ), 0) as balance
FROM accounts a
WHERE a.user_id = ?`);
  const accounts = query.all(userId) as Account[];
  cache.set(cacheKey, accounts);
  return accounts;
}

export function getAccountsSummary(userId: number): { net_worth: number } {
  const cacheKey = `accounts_summary_${userId}`;
  const cached = cache.get<{ net_worth: number }>(cacheKey);
  if (cached) return cached;
  const result = db
    .prepare(
      `SELECT
coalesce((
	sum(CASE WHEN type = 'income' THEN amount ELSE 0 END) -
	sum(CASE WHEN type = 'expense' THEN amount ELSE 0 END)
), 0) as net_worth
FROM transactions
WHERE user_id = ?`,
    )
    .get(userId) as { net_worth: number };
  cache.set(cacheKey, result);
  return result;
}

export function createAccount(account: CreateAccount): number {
  invalidateAccountCache(account.user_id);
  const query = db.prepare(
    "INSERT INTO accounts (name, type,user_id) VALUES (?, ?, ?)",
  );
  const newAccount = query.run(account.name, account.type, account.user_id);
  return Number(newAccount.lastInsertRowid);
}

export function updateAccount(id: number, account: UpdateAccount): number {
  invalidateAccountCache(account.user_id);
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
  invalidateAccountCache(userId);
  const query = db.prepare("DELETE FROM accounts WHERE id = ? AND user_id = ?");
  query.run(id, userId);
}

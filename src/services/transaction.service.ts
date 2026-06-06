import { db } from "../lib/db/database";
import {
  Transaction,
  CreateTransaction,
  UpdateTransaction,
} from "../types/transaction";

export function getTransactions(userId: number): Transaction[] {
  const query = db.prepare(
    "SELECT id, name, amount, description, date, type, recurring_frequency, recurring_day, recurring_interval, user_id, account_id, category_id, group_id FROM transactions WHERE user_id = ?",
  );
  return query.all(userId) as Transaction[];
}

export function getTransactionById(
  id: number,
  userId: number,
): Transaction | null {
  const query = db.prepare(
    "SELECT id, name, amount, description, date, type, recurring_frequency, recurring_day, recurring_interval, user_id, account_id, category_id, group_id FROM transactions WHERE id = ? AND user_id = ?",
  );
  return query.get(id, userId) as Transaction;
}

export function createTransaction(transaction: CreateTransaction): number {
  const query = db.prepare(
    "INSERT INTO transactions (name, amount, description, date, type, recurring_frequency, recurring_day, recurring_interval, user_id, account_id, category_id, group_id) VALUES (?,?,?,?,?,?,?,?,?,?, ?,?)",
  );
  const result = query.run(
    transaction.name,
    transaction.amount,
    transaction.description,
    transaction.date,
    transaction.type,
    transaction.recurring_frequency,
    transaction.recurring_day,
    transaction.recurring_interval,
    transaction.user_id,
    transaction.account_id,
    transaction.category_id,
    transaction.group_id,
  );
  return Number(result.lastInsertRowid);
}

export function updateTransaction(
  id: number,
  transaction: UpdateTransaction,
): number {
  const query = db.prepare(
    "UPDATE transactions SET name = ?, amount = ?, description = ?, date = ?, type = ?, recurring_frequency = ?, recurring_day = ?, recurring_interval = ?, account_id = ?, category_id = ?, group_id = ? WHERE id = ? AND user_id = ?",
  );
  const result = query.run(
    transaction.name,
    transaction.amount,
    transaction.description,
    transaction.date,
    transaction.type,
    transaction.recurring_frequency,
    transaction.recurring_day,
    transaction.recurring_interval,
    transaction.account_id,
    transaction.category_id,
    transaction.group_id,
    id,
    transaction.user_id,
  );
  return Number(result.changes);
}

export function deleteTransaction(id: number, userId: number): void {
  db.prepare("DELETE FROM transactions WHERE id = ? AND user_id = ?").run(
    id,
    userId,
  );
}

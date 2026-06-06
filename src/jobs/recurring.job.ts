import cron from "node-cron";
import { db } from "../lib/db/database";
import { Request } from "express";
import { Transaction } from "../types/transaction";
import { createTransaction } from "../services/transaction.service";

// Documentations
// * * * * *
// │ │ │ │ └── day of week (0-6, Sunday=0)
// │ │ │ └──── month (1-12)
// │ │ └────── day of month (1-31)
// │ └──────── hour (0-23)
// └────────── minute (0-59)
//
// 0 0 * * * ─── every day at midnight
// * * * * * ─── every minute
// Query the recurring transactions due today using your SQL
// For each one, create a new transaction entry with today's date but keep everything else the same
// Log how many were created so you know it ran

export function startRecurringJob() {
  cron.schedule("0 0 * * *", () => {
    // Find all recurring transactions due today based on frequency and schedule
    const query = db.prepare(`
    SELECT * FROM transactions 
    WHERE recurring_frequency IS NOT NULL
    AND (
    (recurring_frequency = 'daily')
    OR
    (recurring_frequency = 'weekly' 
      AND recurring_day = CAST(strftime('%w', 'now') AS INTEGER))
    OR
    (recurring_frequency = 'monthly' 
      AND recurring_day = CAST(strftime('%d', 'now') AS INTEGER))
    OR
    (recurring_frequency = 'yearly'
      AND recurring_day = CAST(strftime('%d', 'now') AS INTEGER)
      AND recurring_month = CAST(strftime('%m', 'now') AS INTEGER))
  )`);

    const transactions = query.all() as Transaction[];
    const date = new Date().toISOString().split("T")[0];
    let updatedEntires = 0;
    for (let transaction of transactions) {
      createTransaction({
        ...transaction,
        date: date,
        recurring_frequency: undefined,
        recurring_day: undefined,
        recurring_month: undefined,
        recurring_interval: undefined,
      });
      updatedEntires++;
    }
    console.log(`updated ${updatedEntires} entries`);
  });
}

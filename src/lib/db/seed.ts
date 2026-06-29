import { db } from "@/lib/db/database";
import { faker } from "@faker-js/faker";
import { createUser, hashPassword } from "@/services/auth.service";
import { createAccount, getAccounts } from "@/services/account.service";
import { Transaction } from "@/types/transaction";
import { createTransaction } from "@/services/transaction.service";
import { getCategories } from "@/services/category.service";
import { unlinkSync, existsSync } from "fs";
import { Env } from "@/types/environment";
import { Account } from "@/types/account";
import { Category } from "@/types/category";

const globalCategories = [
  "Uncategorized",
  "Income",
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Insurance",
  "Saving",
  "Entertainment",
  "Clothing",
  "Healthcare",
  "Debt Repayment",
  "Bank Fees",
  "Work Expense",
  "Miscellaneous",
];

export default async function seedDatabase(env: Env) {
  if (env === "development" && process.env.SEED_ON_STARTUP === "true") {
    if (process.env.DELETE_DB_ON_STARTUP === "true") deleteDatabase();
    const userId = await createTestUser();
    const createdNewAccounts = createTestAccounts(userId);
    const accounts = getAccounts(userId);
    createGlobalCategories();
    const categories = getCategories(0);
    const transactions = createTestTransactions(userId, accounts, categories);
  }

  if (env === "production") {
    createGlobalCategories();
  }
}

// Create Globals Categories
function createGlobalCategories() {
  for (let category of globalCategories) {
    db
      .prepare("INSERT INTO categories (name, is_default) VALUES (?, ?)")
      .run(category, 1).lastInsertRowid;
  }
}

// Generate a user for test purpose
async function createTestUser(): Promise<number> {
  const email = "test@example.com";
  const password = "Password123@";
  const { hash, salt } = await hashPassword(password);
  const userId = createUser(email, hash, salt);
  return userId;
}

// Create the test accounts
function createTestAccounts(userId: number) {
  const newAccounts = [
    {
      name: "Cash",
      type: "cash",
      user_id: userId,
    },
    {
      name: "TD Chequing",
      type: "chequing",
      user_id: userId,
    },
    {
      name: "TD Saving",
      type: "saving",
      user_id: userId,
    },
    {
      name: "KOHO",
      type: "credit",
      user_id: userId,
    },
  ] as Account[];
  for (const account of newAccounts) createAccount(account);
}

function createTestTransactions(
  userId: number,
  accounts: Account[],
  categories: Category[],
) {
  const newTransactions = [
    {
      name: "Employment Insurance",
      amount: 105600,
      date: "2026-06-02",
      type: "income",
      recurring_frequency: "weekly",
      recurring_day: 2,
      recurring_interval: 2,
      user_id: userId,
      account_id: 1,
      category_id: 1,
    },
    {
      name: "Digital Ocean",
      amount: 800,
      date: "2026-06-01",
      type: "expense",
      recurring_frequency: "monthly",
      recurring_day: 1,
      recurring_interval: 1,
      user_id: userId,
      account_id: 1,
      category_id: 13,
    },
    {
      name: "Spotify",
      amount: 1900,
      date: "2026-06-02",
      type: "expense",
      recurring_frequency: "monthly",
      recurring_day: 2,
      recurring_interval: 1,
      user_id: userId,
      account_id: 1,
      category_id: 8,
    },
    {
      name: "Phone",
      amount: 10000,
      date: "2026-06-04",
      type: "expense",
      recurring_frequency: "monthly",
      recurring_day: 4,
      recurring_interval: 1,
      user_id: userId,
      account_id: 1,
      category_id: 5,
    },
    {
      name: "Quebec Taxes",
      amount: 14900,
      date: "2026-06-16",
      type: "expense",
      recurring_frequency: "monthly",
      recurring_day: 16,
      recurring_interval: 1,
      user_id: userId,
      account_id: 1,
      category_id: 11,
    },
    {
      name: "Credit Consolidation",
      amount: 20700,
      date: "2026-06-22",
      type: "expense",
      recurring_frequency: "monthly",
      recurring_day: 22,
      recurring_interval: 1,
      user_id: userId,
      account_id: 1,
      category_id: 11,
    },
    {
      name: "TD Account Fee",
      amount: 2000,
      date: "2026-06-30",
      type: "expense",
      recurring_frequency: "monthly",
      recurring_day: 30,
      recurring_interval: 1,
      user_id: userId,
      account_id: 1,
      category_id: 12,
    },
    {
      name: "Lendcare",
      amount: 5600,
      date: "2026-06-06",
      type: "expense",
      recurring_frequency: "weekly",
      recurring_day: 5,
      recurring_interval: 2,
      user_id: userId,
      account_id: 1,
      category_id: 11,
    },
  ] as Transaction[];
  for (const transaction of newTransactions) createTransaction(transaction);
}

// Random historical transactions with faker default to 20 transactions
function generateRandomTransaction(
  userId: number,
  categories: [],
  accounts: [],
  quantity: number = 20,
) {
  const randomExpenseNames = [
    "Grocery Store",
    "Restaurant",
    "Gas Station",
    "Pharmacy",
    "Coffee Shop",
  ];
  for (let i = 0; i < quantity; i++) {
    createTransaction({
      name: faker.helpers.arrayElement(randomExpenseNames),
      amount: faker.number.int({ min: 500, max: 15000 }), // between $5 and $150
      date: faker.date
        .between({ from: "2026-01-01", to: "2026-06-06" })
        .toISOString()
        .split("T")[0],
      type: "expense",
      user_id: userId,
      account_id: faker.helpers.arrayElement(accounts),
      category_id: faker.helpers.arrayElement(categories),
    });
  }
}

// Cleanup — use db directly delete in reverse order of dependencies
function resetTables() {
  db.exec(`DELETE FROM categories`);
  db.exec(`DELETE FROM transactions`);
  db.exec(`DELETE FROM users_sessions `);
  db.exec(`DELETE FROM accounts`);
  db.exec(`DELETE FROM users`);
}

// Delete development database
function deleteDatabase() {
  const filesToDelete = [
    "development.db",
    "development.db-shm",
    "development.db-wal",
  ];
  try {
    for (const file of filesToDelete) {
      if (existsSync(file)) {
        unlinkSync(file);
      }
      console.log(`Deleted the file: ${file}`);
    }
  } catch (err) {
    console.log("An error occurred while deleting the development database");
  }
}

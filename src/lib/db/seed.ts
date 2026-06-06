import { db } from "@/lib/db/database";
import { faker } from "@faker-js/faker";
import { createUser, hashPassword } from "@/services/auth.service";
import { createAccount } from "@/services/account.service";
import { CreateTransaction } from "@/types/transaction";
import { createTransaction } from "@/services/transaction.service";

console.log("🏁 Seed start");

// Cleanup — use db directly delete in reverse order of dependencies
db.exec(`DELETE FROM groups`);
db.exec(`DELETE FROM categories`);
db.exec(`DELETE FROM transactions`);
db.exec(`DELETE FROM accounts`);
db.exec(`DELETE FROM users`);

const email = "inbox@mauricefh.com";
const password = "Password123@";
const { hash, salt } = await hashPassword(password);
const userId = createUser(email, hash, salt);

const cashAccountId = createAccount({
  name: "Cash",
  type: "cash",
  user_id: userId,
});
const tdCheckingAccountId = createAccount({
  name: "TD Bank Checking",
  type: "checking",
  user_id: userId,
});
const tdSavingAccountId = createAccount({
  name: "TD Bank Saving",
  type: "saving",
  user_id: userId,
});
const kohoAccountId = createAccount({
  name: "KOHO",
  type: "credit",
  user_id: userId,
});

// income - $1056 biweekly on tuesday on account id 2
const newTransactions: CreateTransaction[] = [
  {
    name: "Employment Insurance",
    amount: 105600,
    date: "2026-06-02",
    type: "income",
    recurring_frequency: "weekly",
    recurring_day: 2,
    recurring_interval: 2,
    user_id: userId,
    account_id: tdCheckingAccountId,
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
    account_id: tdCheckingAccountId,
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
    account_id: tdCheckingAccountId,
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
    account_id: tdCheckingAccountId,
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
    account_id: tdCheckingAccountId,
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
    account_id: tdCheckingAccountId,
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
    account_id: tdCheckingAccountId,
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
    account_id: tdCheckingAccountId,
  },
];

for (const transaction of newTransactions) {
  createTransaction(transaction);
}

// Random historical transactions with faker
const randomExpenseNames = [
  "Grocery Store",
  "Restaurant",
  "Gas Station",
  "Pharmacy",
  "Coffee Shop",
];
for (let i = 0; i < 20; i++) {
  createTransaction({
    name: faker.helpers.arrayElement(randomExpenseNames),
    amount: faker.number.int({ min: 500, max: 15000 }),
    date: faker.date
      .between({ from: "2026-01-01", to: "2026-06-06" })
      .toISOString()
      .split("T")[0],
    type: "expense",
    user_id: userId,
    account_id: faker.helpers.arrayElement([
      tdCheckingAccountId,
      kohoAccountId,
      cashAccountId,
    ]),
  });
}

console.log("✅ Seed complete");

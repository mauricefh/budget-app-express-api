import { Env } from "@/types/environment";
import { db } from "./database";

export default function createDatabaseFromSchema(env: Env) {
  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_users_user_email ON users(email)`);

  db.exec(`
  CREATE TABLE IF NOT EXISTS users_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL UNIQUE,
    expire_at DATETIME NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);
  db.exec(
    `CREATE INDEX IF NOT EXISTS idx_users_sessions_user_token ON users_sessions(token)`,
  );

  db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('cash', 'chequing', 'saving', 'credit', 'loan')) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);
  db.exec(
    `CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id)`,
  );

  db.exec(`
  CREATE TABLE IF NOT EXISTS categories(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user_id INTEGER,
    is_default BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

  db.exec(`
  CREATE TABLE IF NOT EXISTS transactions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
    recurring_frequency TEXT CHECK(recurring_frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    recurring_day INTEGER,
    recurring_month INTEGER,
    recurring_interval INTEGER DEFAULT 1,
    user_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    category_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
  )
`);
  db.exec(
    `CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)`,
  );
  db.exec(
    `CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id)`,
  );
}

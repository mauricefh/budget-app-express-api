import Database from "better-sqlite3";

const database = process.env.DB_URL ?? "development.db";

// Export db so we can have a single source of connection (singleton?)
export const db = new Database(database, { verbose: console.log });
db.pragma("journal_mode = WAL");

import Database from "better-sqlite3";

// Export db so we can have a single source of connection (singleton?)
export const db = new Database("sqlite.db", { verbose: console.log });
db.pragma("journal_mode = WAL");

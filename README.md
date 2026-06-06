## ✅ Done

**Infrastructure**

- Express + TypeScript + ESM with `tsx` and `nodemon`
- SQLite with `better-sqlite3`, WAL mode
- Path aliases with `@/`
- Seed script with faker and real hashed passwords

**Database schema**

- `users`, `users_sessions`, `accounts`, `categories`, `groups`, `transactions`
- Proper indexes, foreign keys, CASCADE rules, CHECK constraints

**Auth (Phase 1)**

- Register with scrypt hashing, random salt, timing-safe comparison
- Login with session token, HttpOnly cookie
- Logout with session deletion
- `requireAuth` middleware
- `x-powered-by` header disabled

**Accounts (Phase 2)**

- GET, POST, DELETE with ownership validation

**Transactions (Phase 2)**

- GET all, GET by id, POST, PUT, DELETE with ownership validation

**Recurring transactions (Phase 3)**

- Cron job running daily at midnight
- Handles daily, weekly, monthly, yearly with interval support
- Strips recurring fields from generated entries

---

## ⬜ Still to do

**Phase 3 remaining**

- Categories CRUD
- Groups CRUD
- Caching for repeated queries

**Phase 4**

- Offline support and sync

**Phase 5**

- Input validation (email format, password length, amount > 0)
- Extract repeated `userId` check into helper
- Error handling consistency
- `biweekly` interval support on weekly transactions
- Missed job problem on server restart

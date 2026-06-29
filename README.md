# Budget App — Express API

A RESTful backend API for a personal budgeting application, built with **Express 5**, **TypeScript (ESM)**, and **SQLite** via `better-sqlite3`. Authentication is implemented from scratch — no third-party auth libraries.

---

## Tech Stack

| Layer       | Technology                                             |
| ----------- | ------------------------------------------------------ |
| Runtime     | Node.js + TypeScript (ESM)                             |
| Framework   | Express 5                                              |
| Database    | SQLite (`better-sqlite3`, WAL mode)                    |
| Auth        | Scrypt + random salt, session tokens, HttpOnly cookies |
| Scheduling  | `node-cron`                                            |
| Validation  | Zod                                                    |
| Dev tooling | `tsx`, `nodemon`, Prettier, pnpm                       |
| API testing | Bruno                                                  |

---

## Project Structure

```
budget-app-express-api/
├── src/
│   ├── index.ts          # Entry point
│   ├── lib/
│   │   └── db/
│   │       └── seed.ts   # Faker-based seed script
│   └── ...               # Routes, middleware, controllers
├── bruno/                # Bruno API collection
├── package.json
├── tsconfig.json
├── mise.toml
└── .prettierrc
```

---

## Database Schema

Six tables with proper indexes, foreign keys, CASCADE rules, and CHECK constraints:

- `users` — email, hashed password, salt
- `users_sessions` — session tokens linked to users
- `accounts` — bank/wallet accounts owned by users
- `categories` — transaction categories
- `groups` — groupings of categories
- `transactions` — individual income/expense records with recurring support

---

## Features

### ✅ Auth (Phase 1)

- **Register** — email/password, scrypt hashing with random salt
- **Login** — session token issued, set as HttpOnly cookie
- **Logout** — session deleted from database
- `requireAuth` middleware protecting all private routes
- `x-powered-by` header disabled
- Timing-safe password comparison (`timingSafeEqual`) to prevent timing attacks
- User enumeration protection on login failure

### ✅ Accounts (Phase 2)

- `GET /accounts` — list accounts for authenticated user
- `POST /accounts` — create account
- `DELETE /accounts/:id` — delete with ownership validation

### ✅ Transactions (Phase 2)

- `GET /transactions` — list all transactions for user
- `GET /transactions/:id` — get single transaction
- `POST /transactions` — create transaction
- `PUT /transactions/:id` — update transaction
- `DELETE /transactions/:id` — delete transaction
- Ownership validation on all routes

### ✅ Recurring Transactions (Phase 3)

- Cron job running daily at midnight
- Supports `daily`, `weekly`, `monthly`, `yearly` with interval support
- Auto-generated entries have recurring fields stripped

### ✅ Categories (Phase 3)

- Full CRUD with ownership validation

### ✅ Infrastructure (Phase 3)

- In-memory caching via `node-cache` for repeated queries
- Shared `userId` ownership helper extracted across routes

---

## Getting Started

### Prerequisites

- Node.js (managed via `mise`)
- pnpm `^11.3.0`

### Install

```bash
pnpm install
```

### Seed the database

```bash
pnpm db:seed
```

### Run in development

```bash
pnpm dev
```

### Run in production

```bash
pnpm start
```

---

## Environment Variables

Create a `.env` file at the root:

```env
BASE_URL=https://api-url-here.com
PORT=8080
DB_URL=production.db
DEBUG=false
SEED_ON_STARTUP=false
# Add any secrets here (e.g. SESSION_SECRET)
```

---

## Roadmap

### Phase 4

- [ ] Offline support and sync

### Phase 5

- [ ] Input validation (email format, password length, amount > 0) via Zod
- [ ] Consistent error handling across routes
- [ ] `biweekly` interval support for weekly recurring transactions
- [ ] Handle missed cron jobs on server restart

---

## API Testing

This project uses [Bruno](https://www.usebruno.com/) for API testing. Collection files are located in `bruno/budget-app-backend-api/`.

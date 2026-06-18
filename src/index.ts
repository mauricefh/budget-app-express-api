import "./config";
import express from "express";
import cookieParser from "cookie-parser";
import home from "./routes/home.route";
import auth from "./routes/auth.route";
import user from "./routes/user.route";
import account from "./routes/account.route";
import transaction from "./routes/transaction.route";
import category from "./routes/category.route";
import { startRecurringJob } from "./jobs/recurring.job";
import startup from "./startup";
import { Env } from "./types/environment";

// Check that all env are set and create/update database and seed it
const env = process.env.NODE_ENV as Env;
startup(env);

// Setup
const app = express();

// Security
app.disable("x-powered-by");

// Allow reading cookie from the browser using the cookie-parser package
app.use(cookieParser());

// Allow json request parsing
app.use(express.json());

// Route
app.use("/", home);
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/accounts", account);
app.use("/api/transactions", transaction);
app.use("/api/categories", category);

// Background Jobs
startRecurringJob();

app.listen(process.env.PORT, () => {
  console.log(
    `🚀 Server ready at: ${process.env.BASE_URL}:${process.env.PORT}`,
  );
});

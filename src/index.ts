import "./config";
import "./lib/db/schema";
import express from "express";
import cookieParser from "cookie-parser";
import home from "./routes/home.route";
import auth from "./routes/auth.route";
import user from "./routes/user.route";
import account from "./routes/account.route";
import transaction from "./routes/transaction.route";
import { startRecurringJob } from "./jobs/recurring.job";

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

// Background Jobs
startRecurringJob();

app.listen(process.env.PORT, () => {
  console.log(
    `🚀 Server ready at: ${process.env.BASE_URL}:${process.env.PORT}`,
  );
});

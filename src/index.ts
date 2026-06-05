import express from "express";
import "./lib/db/schema";
import cookieParser from "cookie-parser";
import home from "./routes/home.route";
import auth from "./routes/auth.route";
import user from "./routes/user.route";

// Setup
const port = 3000;
const app = express();
app.disable("x-powered-by");

// Allow reading cookie from the browser using the cookie-parser package
app.use(cookieParser());

// Allow json request parsing
app.use(express.json());

// Route
app.use("/", home);
app.use("/api/auth", auth);
app.use("/api/user", user);

app.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}`);
});

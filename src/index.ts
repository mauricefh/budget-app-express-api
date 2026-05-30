import express from "express";
import "./lib/db/schema";
import home from "./routes/home.route";
import register from "./routes/auth.route";

// Setup
const app = express();
const port = 3000;

// Allow json request parsing
app.use(express.json());

// Route
app.use("/", home);
app.use("/api/auth", register);

app.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}`);
});

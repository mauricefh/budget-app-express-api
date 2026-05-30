import express from "express";
import "./lib/db/schema";

const app = express();
const port = 3000;

// Allow json request parsing
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}`);
});

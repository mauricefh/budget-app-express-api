import express from "express";
import {
  createUser,
  findUserByEmail,
  findUserByEmailWithCredentials,
  hashPassword,
  verifyPassword,
} from "../services/auth.service";
import { createSession, deleteSession } from "../services/session.service";
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).send("Missing email field");
    if (!password) return res.status(400).send("Missing password field");
    const user = findUserByEmail(email);
    if (user)
      return res.status(409).send(`User with email: ${email} already exists`);

    const { hash, salt } = await hashPassword(password);

    const newUserId = createUser(email, hash, salt);
    res.status(201).json({ id: newUserId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    // 1. Get email and password from body
    const { email, password } = req.body;

    // 2. Validate they exist
    if (!email) return res.status(400).send("Missing email field");
    if (!password) return res.status(400).send("Missing password field");

    // 3. Find user with credentials
    const user = findUserByEmailWithCredentials(email);

    // 4. If no user — return 401
    if (!user) return res.status(401).send("Wrong email or password");

    // 5. Verify password
    const isPasswordValid = await verifyPassword(
      password,
      user.salt,
      user.password,
    );

    // 6. If wrong — return 401
    if (!isPasswordValid)
      return res.status(401).send("Wrong email or password");

    // 7. If correct — create session, generate cookies and return 200
    const token = createSession(user.id);
    res
      .status(200)
      .cookie("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      })
      .json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies.session;
    if (!token) return res.status(400).send("No session found");
    deleteSession(token);
    res.clearCookie("session");
    res.status(200).json({ message: "Logged out seccessfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

export default router;

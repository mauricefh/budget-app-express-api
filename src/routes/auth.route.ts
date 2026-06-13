import express from "express";
import {
  createUser,
  findUserByEmail,
  findUserByEmailWithCredentials,
  hashPassword,
  verifyPassword,
} from "../services/auth.service";
import { createSession, deleteSession } from "../services/session.service";
import { sendCreated, sendError, sendSuccess } from "utils/response.utils";
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return sendError(res, 400, "Missing email");
    if (!password) return sendError(res, 400, "Missing password");
    const user = findUserByEmail(email);
    if (user)
      return sendError(res, 409, `User with email: ${email} already exists`);

    const { hash, salt } = await hashPassword(password);

    const id = createUser(email, hash, salt);
    return sendCreated(res, { id });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    // 1. Get email and password from body
    const { email, password } = req.body;

    // 2. Validate they exist
    if (!email) return sendError(res, 400, "Missing email");
    if (!password) return sendError(res, 400, "Missing password");

    // 3. Find user with credentials
    const user = findUserByEmailWithCredentials(email);

    // 4. If no user — return 401
    if (!user) return sendError(res, 401, "Wrong email or password");

    // 5. Verify password
    const isPasswordValid = await verifyPassword(
      password,
      user.salt,
      user.password,
    );

    // 6. If wrong — return 401
    if (!isPasswordValid) return sendError(res, 401, "Wrong email or password");

    // 7. If correct — create session, generate cookies and return 200
    const token = createSession(user.id);
    return res
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
    return sendError(res, 500, "Internal server error");
  }
});

router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies.session;
    if (!token) sendError(res, 400, "No session found");
    deleteSession(token);
    res.clearCookie("session");
    return sendSuccess(res);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

export default router;

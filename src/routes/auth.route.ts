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
import { loginSchema, registerSchema } from "@/lib/schema";
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    // Validation
    const result = registerSchema.safeParse(req.body);
    if (!result.success)
      return sendError(res, 400, result.error.issues[0].message);

    // Data
    const { email, password } = result.data;

    // Check if user already existe
    const user = findUserByEmail(email);
    if (user)
      return sendError(res, 409, `User with email: ${email} already exists`);

    // Transformation
    const { hash, salt } = await hashPassword(password);

    // Creation
    const id = createUser(email, hash, salt);
    return sendCreated(res, { id });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    // Validation
    const result = loginSchema.safeParse(req.body);
    if (!result.success)
      return sendError(res, 400, result.error.issues[0].message);

    // Data
    const { email, password } = result.data;

    // Find user with credentials
    const user = findUserByEmailWithCredentials(email);

    // If no user — return 401
    if (!user) return sendError(res, 401, "Wrong email or password");

    // Verify password
    const isPasswordValid = await verifyPassword(
      password,
      user.salt,
      user.password,
    );

    // If wrong — return 401
    if (!isPasswordValid) return sendError(res, 401, "Wrong email or password");

    // If correct — create session, generate cookies and return 200
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

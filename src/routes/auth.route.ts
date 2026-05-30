import express from "express";
import {
  createUser,
  findUserByEmail,
  hashPassword,
} from "../services/auth.service";
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

export default router;

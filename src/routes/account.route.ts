import express from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  createAccount,
  deleteAccount,
  getAccounts,
} from "../services/account.service";
import { CreateAccount } from "../types/account";
const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("User ID Not found. Are you connected?");

    const accounts = getAccounts(userId);
    console.log("account", accounts);
    return res.status(200).send(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/", requireAuth, (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("User ID Not found. Are you connected?");
    const { name, type } = req.body;
    const newAccount: CreateAccount = { name, type, user_id: userId };
    const account = createAccount(newAccount);
    return res
      .status(201)
      .send({ account: account, message: "Account created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.delete("/:id", requireAuth, (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user?.id;
    if (!id || isNaN(id) || !userId) throw new Error("Invalid account id");
    deleteAccount(id, userId);
    return res.status(200).send({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

export default router;

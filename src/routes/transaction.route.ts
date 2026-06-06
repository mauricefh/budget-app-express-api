import express from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
} from "../services/transaction.service";
import { CreateTransaction, UpdateTransaction } from "../types/transaction";
const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("userId not found");
    const transactions = getTransactions(userId);
    return res.status(200).send(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.get("/:id", requireAuth, (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("userId not found");
    const id = Number(req.params.id);
    if (!id) return res.status(400).send("Missing id");
    const transaction = getTransactionById(id, userId);
    if (!transaction) return res.status(400).send("Transaction not found");
    return res.status(200).send(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/", requireAuth, (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("userId not found");

    const {
      name,
      amount,
      description,
      date,
      type,
      recurring_frequency,
      recurring_day,
      recurring_month,
      recurring_interval,
      account_id,
      category_id,
      group_id,
    } = req.body;
    if (!name) return res.status(400).send("Missing name");
    if (!amount) return res.status(400).send("Missing amount");
    if (!date) return res.status(400).send("Missing date");
    if (!type) return res.status(400).send("Missing type");
    if (!account_id) return res.status(400).send("Missing account_id");

    const newTransaction = {
      name,
      amount,
      description,
      date,
      type,
      recurring_frequency,
      recurring_day,
      recurring_month,
      recurring_interval,
      user_id: userId,
      account_id,
      category_id,
      group_id,
    } as CreateTransaction;

    const id = createTransaction(newTransaction);
    return res.status(201).send({
      id,
      message: "Transaction created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.put("/:id", requireAuth, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) throw new Error("Invalid account id");
    const userId = req.user?.id;
    if (!userId) throw new Error("userId not found");

    const {
      name,
      amount,
      description,
      date,
      type,
      recurring_frequency,
      recurring_day,
      recurring_month,
      recurring_interval,
      account_id,
      category_id,
      group_id,
    } = req.body;

    if (!name) return res.status(400).send("Missing name");
    if (!amount) return res.status(400).send("Missing amount");
    if (!date) return res.status(400).send("Missing date");
    if (!type) return res.status(400).send("Missing type");
    if (!account_id) return res.status(400).send("Missing account_id");

    const updatedTransaction = {
      name,
      amount,
      description,
      date,
      type,
      recurring_frequency,
      recurring_day,
      recurring_month,
      recurring_interval,
      user_id: userId,
      account_id,
      category_id,
      group_id,
    } as UpdateTransaction;

    const changes = updateTransaction(id, updatedTransaction);
    if (changes === 0) return res.status(404).send("Transaction not found");
    return res.status(200).send({
      id,
      message: "Transaction updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.delete("/:id", requireAuth, (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("userId not found");
    const id = Number(req.params.id);
    if (!id || isNaN(id)) return res.status(400).send("Invalid id");
    deleteTransaction(id, userId);
    return res
      .status(200)
      .send({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

export default router;

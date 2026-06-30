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
import { getParamId, getUserId } from "utils/request.utils";
import { sendCreated, sendError, sendSuccess } from "utils/response.utils";
import { transactionSchema } from "@/lib/schema";
const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  try {
    const userId = getUserId(req);
    const transactions = getTransactions(userId);
    return sendSuccess(res, transactions);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

router.get("/:id", requireAuth, (req, res) => {
  try {
    const userId = getUserId(req);
    const id = getParamId(req);

    const transaction = getTransactionById(id, userId);
    if (!transaction) return sendError(res, 404, "Transactions Not Found");

    return sendSuccess(res, transaction);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

router.post("/", requireAuth, (req, res) => {
  try {
    const userId = getUserId(req);
    const result = transactionSchema.safeParse(req.body);
    if (!result.success)
      return sendError(res, 400, result.error.issues[0].message);

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
    } = result.data;

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
      category_id: category_id ?? 1,
    } as CreateTransaction;

    const id = createTransaction(newTransaction);
    return sendCreated(res, { id });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

router.put("/:id", requireAuth, (req, res) => {
  try {
    const userId = getUserId(req);
    const id = getParamId(req);

    const result = transactionSchema.safeParse(req.body);
    if (!result.success)
      return sendError(res, 400, result.error.issues[0].message);

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
    } = result.data;

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
      category_id: category_id ?? 1,
    } as UpdateTransaction;

    const changes = updateTransaction(id, updatedTransaction);
    if (changes === 0) return sendError(res, 404, "Transaction not found");
    return sendSuccess(res, { id });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

router.delete("/:id", requireAuth, (req, res) => {
  try {
    const userId = getUserId(req);
    const id = getParamId(req);
    deleteTransaction(id, userId);
    return sendSuccess(res);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

export default router;

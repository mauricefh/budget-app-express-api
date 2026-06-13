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
    } = req.body;
    if (!name) return sendError(res, 400, "Missing name");
    if (!amount) return sendError(res, 400, "Missing amount");
    if (!date) return sendError(res, 400, "Missing date");
    if (!type) return sendError(res, 400, "Missing type");
    if (!account_id) return sendError(res, 400, "Missing account_id");

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
    } = req.body;

    if (!name) return sendError(res, 400, "Missing name");
    if (!amount) return sendError(res, 400, "Missing amount");
    if (!date) return sendError(res, 400, "Missing date");
    if (!type) return sendError(res, 400, "Missing type");
    if (!account_id) return sendError(res, 400, "Missing account_id");

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

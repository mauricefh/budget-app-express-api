import express from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  createAccount,
  deleteAccount,
  getAccounts,
  getAccountsSummary,
  updateAccount,
} from "../services/account.service";
import { CreateAccount, UpdateAccount } from "../types/account";
import { getParamId, getUserId } from "utils/request.utils";
import { sendCreated, sendError, sendSuccess } from "utils/response.utils";
import { accountSchema } from "@/lib/schema";
import { formatCurrencyForDisplay } from "utils/format.utils";
const router = express.Router();

router.get("/summary", requireAuth, (req, res) => {
  try {
    const userId = getUserId(req);
    const { net_worth } = getAccountsSummary(userId);
    const net_worth_formatted = formatCurrencyForDisplay(net_worth);
    return sendSuccess(res, { net_worth, net_worth_formatted });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

router.get("/", requireAuth, (req, res) => {
  try {
    const userId = getUserId(req);
    const accounts = getAccounts(userId).map((account) => ({
      ...account,
      formatted_balance: formatCurrencyForDisplay(account.balance),
    }));
    return sendSuccess(res, accounts);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

router.post("/", requireAuth, (req, res) => {
  try {
    const userId = getUserId(req);
    const result = accountSchema.safeParse(req.body);
    if (!result.success)
      return sendError(res, 400, result.error.issues[0].message);

    const { name, type } = result.data;
    const newAccount: CreateAccount = { name, type, user_id: userId };
    const id = createAccount(newAccount);
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
    const result = accountSchema.safeParse(req.body);
    if (!result.success)
      return sendError(res, 400, result.error.issues[0].message);

    const { name, type } = result.data;
    const updatedAccount = { name, type, user_id: userId } as UpdateAccount;
    const changes = updateAccount(id, updatedAccount);
    if (changes === 0) return sendError(res, 404, "Account not found");
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
    deleteAccount(id, userId);
    return sendSuccess(res);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

export default router;

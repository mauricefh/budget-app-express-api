import express from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { sendError, sendSuccess } from "utils/response.utils";
const router = express.Router();

router.get("/me", requireAuth, (req, res) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, 404, "User Not Found");
    return sendSuccess(res, user);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

export default router;

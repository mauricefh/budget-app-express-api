import express from "express";
import { sendError, sendSuccess } from "utils/response.utils";
const router = express.Router();

router.get("/", (req, res) => {
  try {
    return sendSuccess(res);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

export default router;

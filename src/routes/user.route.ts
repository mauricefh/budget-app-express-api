import express from "express";
import { requireAuth } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/me", requireAuth, (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

export default router;

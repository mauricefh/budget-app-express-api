import express from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "@/services/category.service";
import { CreateCategory, UpdateCategory } from "@/types/category";
import { getParamId, getUserId } from "utils/request.utils";
import { sendCreated, sendError, sendSuccess } from "utils/response.utils";
const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  try {
    const userId = getUserId(req);
    const categories = getCategories(userId);
    return sendSuccess(res, categories);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

router.get("/:id", requireAuth, (req, res) => {
  try {
    const userId = getUserId(req);
    const id = getParamId(req);
    const category = getCategoryById(id, userId);
    return sendSuccess(res, category);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

router.post("/", requireAuth, (req, res) => {
  try {
    const userId = getUserId(req);

    const { name } = req.body;
    if (!name) return sendError(res, 400, "Missing name");
    const newCategory = { name, user_id: userId } as CreateCategory;

    const id = createCategory(newCategory);
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
    const { name } = req.body;
    if (!name) return sendError(res, 400, "Missing name");
    const updatedCategory = { name, user_id: userId } as UpdateCategory;
    const changes = updateCategory(id, updatedCategory);
    if (changes === 0) return sendError(res, 404, "Category not found");
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
    deleteCategory(id, userId);
    return sendSuccess(res);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
});

export default router;

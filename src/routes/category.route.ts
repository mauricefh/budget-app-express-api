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
const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("userId not found");
    const categories = getCategories(userId);
    return res.status(200).send(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.get("/:id", requireAuth, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new Error("id is invalid");
    const userId = req.user?.id;
    if (!userId) throw new Error("userId not found");
    const category = getCategoryById(id, userId);
    return res.status(200).send(category);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post("/", requireAuth, (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("userId not found");

    const { name } = req.body;
    if (!name) return res.status(400).send("Missing name");
    const newCategory = { name, user_id: userId } as CreateCategory;

    const id = createCategory(newCategory);
    return res.status(201).send({
      id,
      message: "Category created successfully",
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

    const { name } = req.body;
    if (!name) return res.status(400).send("Missing name");

    const updatedCategory = { name, user_id: userId } as UpdateCategory;
    const changes = updateCategory(id, updatedCategory);
    if (changes === 0) return res.status(404).send("Category not found");
    return res.status(200).send({
      id,
      message: "Category updated successfully",
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
    deleteCategory(id, userId);
    return res.status(200).send({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

export default router;

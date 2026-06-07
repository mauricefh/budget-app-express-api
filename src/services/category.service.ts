import { Category, CreateCategory, UpdateCategory } from "@/types/category";
import { db } from "../lib/db/database";

export function getCategories(
  userId: number,
  includeGlobal: boolean = true,
): Category[] {
  const query = db.prepare("SELECT * FROM categories WHERE user_id = ?");
  return query.all(userId) as Category[];
}

export function getCategoryById(id: number, userId: number): Category {
  const query = db.prepare(
    "SELECT * FROM categories WHERE id = ? AND user_id = ?",
  );
  return query.get(id, userId) as Category;
}

export function createCategory(category: CreateCategory): number {
  const query = db.prepare(
    "INSERT INTO categories (name, user_id) VALUES (?, ?)",
  );
  const result = query.run(category.name, category.user_id);
  return Number(result.lastInsertRowid);
}

export function updateCategory(id: number, category: UpdateCategory): number {
  const query = db.prepare(
    "UPDATE categories SET name = ? WHERE id = ? AND user_id = ?",
  );
  const result = query.run(category.name, id, category.user_id);
  return Number(result.changes);
}

export function deleteCategory(id: number, userId: number): void {
  db.prepare("DELETE FROM categories WHERE id = ? AND user_id = ?").run(
    id,
    userId,
  );
}

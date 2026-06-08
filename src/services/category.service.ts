import { Category, CreateCategory, UpdateCategory } from "@/types/category";
import { db } from "../lib/db/database";
import cache from "@/lib/cache";

export function getCategories(userId: number): Category[] {
  const cacheGlobalKey = `categories_global`;
  const cacheUserKey = `categories_${userId}`;
  const cachedGlobalCategories = cache.get<Category[]>(cacheGlobalKey);
  const cachedUserCategories = cache.get<Category[]>(cacheUserKey);

  const globalCategories =
    cachedGlobalCategories ??
    (() => {
      const result = db
        .prepare("SELECT * FROM categories WHERE user_id IS NULL")
        .all() as Category[];
      cache.set(cacheGlobalKey, result, 86400);
      return result;
    })();

  const userCategories =
    cachedUserCategories ??
    (() => {
      const result = db
        .prepare("SELECT * FROM categories WHERE user_id = ?")
        .all(userId) as Category[];
      cache.set(cacheUserKey, result);
      return result;
    })();

  return [...globalCategories, ...userCategories];
}

export function getCategoryById(id: number, userId: number): Category {
  const query = db.prepare(
    "SELECT * FROM categories WHERE id = ? AND user_id = ?",
  );
  return query.get(id, userId) as Category;
}

export function createCategory(category: CreateCategory): number {
  const cacheKey = `categories_${category.user_id}`;
  cache.del(cacheKey);
  const query = db.prepare(
    "INSERT INTO categories (name, user_id) VALUES (?, ?)",
  );
  const newCategory = query.run(category.name, category.user_id);
  return Number(newCategory.lastInsertRowid);
}

export function updateCategory(id: number, category: UpdateCategory): number {
  const cacheKey = `categories_${category.user_id}`;
  cache.del(cacheKey);
  const query = db.prepare(
    "UPDATE categories SET name = ? WHERE id = ? AND user_id = ?",
  );
  const updatedCategory = query.run(category.name, id, category.user_id);
  return Number(updatedCategory.changes);
}

export function deleteCategory(id: number, userId: number): void {
  const cacheKey = `categories_${userId}`;
  cache.del(cacheKey);
  const query = db.prepare(
    "DELETE FROM categories WHERE id = ? AND user_id = ?",
  );
  query.run(id, userId);
}

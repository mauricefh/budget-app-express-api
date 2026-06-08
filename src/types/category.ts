import { Base } from "./base";
import { User } from "./user";

export type Category = Base & {
  name: string;
  is_default?: boolean;
  user_id?: number;
  user?: User;
};

export type CreateCategory = Omit<Category, "id" | "created_at" | "user">;

export type UpdateCategory = Omit<Category, "created_at" | "user"> & {
  name?: string;
};

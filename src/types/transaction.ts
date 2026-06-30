import { Account } from "./account";
import { Base } from "./base";
import { Category } from "./category";
import { User } from "./user";

export type Transaction = Base & {
  name: string;
  amount: number;
  formatted_amount: string;
  description?: string;
  date: string;
  type: "income" | "expense";
  recurring_frequency?: "daily" | "weekly" | "monthly" | "yearly";
  recurring_day?: number;
  recurring_month?: number;
  recurring_interval?: number;
  user_id: number;
  account_id: number;
  category_id: number;
  user?: User;
  account?: Account;
  category?: Category;
};

export type CreateTransaction = Omit<
  Transaction,
  "id" | "formatted_amount" | "created_at" | "user" | "account" | "category"
>;

export type UpdateTransaction = Omit<
  Transaction,
  "formatted_amount" | "created_at" | "user" | "account" | "category"
> & {
  name?: string;
  amount?: number;
  description?: string;
  date?: string;
  type?: "income" | "expense";
  recurring_frequency?: "daily" | "weekly" | "monthly" | "yearly";
  recurring_day?: number;
  recurring_month?: number;
  recurring_interval?: number;
  account_id?: number;
  category_id?: number;
};

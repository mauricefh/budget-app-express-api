import { Account } from "./account";
import { Base } from "./base";
import { Category } from "./category";
import { Group } from "./group";
import { User } from "./user";

export type Transaction = Base & {
  name: string;
  amount: number;
  description?: string;
  date: string;
  type: "income" | "expense";
  recurring_frequency?: "daily" | "weekly" | "monthly" | "yearly";
  recurring_day?: number;
  recurring_month?: number;
  recurring_interval?: number;
  user_id: number;
  account_id: number;
  category_id?: number;
  group_id?: number;
  user?: User;
  account?: Account;
  category?: Category;
  group?: Group;
};

export type CreateTransaction = Omit<
  Transaction,
  "id" | "created_at" | "user" | "account" | "category" | "group"
>;

export type UpdateTransaction = Omit<
  Transaction,
  "created_at" | "user" | "account" | "category" | "group"
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
  group_id?: number;
};

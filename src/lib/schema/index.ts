import * as z from "zod";
import {
  accountTypeEnum,
  transactionRecurringFrequencyEnum,
  transactionTypeEnum,
} from "constant";

export const registerSchema = z.object({
  email: z.email("Email is not in a valid format").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be greater than 8 characters")
    .max(72, "Password must be smaller then 72 characters"),
});

export const loginSchema = z.object({
  email: z.email("Email is not in a valid format").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(
    ["cash", "chequing", "saving", "credit", "loan"],
    "Account type is required",
  ),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const transactionSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().nullish(),
    amount: z
      .number("Amount must be a number")
      .positive("Amount must be greater than 0"),
    date: z.string().regex(/\d{4}-\d{2}-\d{2}/gm),
    type: z.enum(
      ["income", "expense"],
      "Type must be either income or expense",
    ),
    account_id: z.number("Account id required").min(1),
    category_id: z.number("Category is required").min(1).default(1).nullish(),
    recurring_frequency: z
      .enum(
        ["daily", "weekly", "monthly", "yearly"],
        "Please select a recurring frequency",
      )
      .nullish(),
    recurring_day: z.number().min(1).max(31).nullish(),
    recurring_month: z.number().min(1).max(12).nullish(),
    recurring_interval: z.number().min(1).nullish(),
  })
  .refine(
    (data) => {
      // if the callback return false will return an error message
      if (data.recurring_frequency === "weekly") {
        if (data.recurring_day == null) return false;
        if (data.recurring_day < 1 || data.recurring_day > 7) return false;
      }
      return true;
    },
    {
      error:
        "The recurring day must be between 1 and 7 when recurring frequenecy is weekly",
      path: ["recurring_day"],
    },
  )
  .refine(
    (data) => {
      if (data.recurring_frequency === "monthly") {
        if (data.recurring_day == null) return false;
        if (data.recurring_day < 1 || data.recurring_day > 31) return false;
      }
      return true;
    },
    {
      error:
        "The recurring day must be between 1 and 31 when recurring frequenecy is monthly",
      path: ["recurring_day"],
    },
  )
  .refine(
    (data) => {
      if (data.recurring_frequency === "yearly") {
        if (data.recurring_day == null) return false;
        if (data.recurring_day < 1 || data.recurring_day > 31) return false;
      }
      return true;
    },
    {
      error:
        "The recurring day must be between 1 and 31 when recurring frequenecy is yearly",
      path: ["recurring_day"],
    },
  )
  .refine(
    (data) => {
      if (data.recurring_frequency === "yearly") {
        if (data.recurring_month == null) return false;
        if (data.recurring_month < 1 || data.recurring_month > 12) return false;
      }
      return true;
    },
    {
      error:
        "The recurring month must be between 1 and 12 when recurring frequenecy is yearly",
      path: ["recurring_month"],
    },
  );

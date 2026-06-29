import * as z from "zod";

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
  name: z.string().min(1, "Name cannot be empty"),
  type: z.enum(
    ["cash", "chequing", "saving", "credit", "loan"],
    "Please select an account type",
  ),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
});

/**
 * Validate the transaction creation schema.
 * name: minimum of 1 char, not white space
 * amount: positive number
 * description: optional
 * date: format YYYY-MM-DD
 * type: income or expense
 * recurring_frequency: daily, weekly, monthly or yearly
 * recurring_day: if recurring_frequency = weekly: number between 1 and 7
 *                if recurring_frequency = monthly number between 1 and 31
 *                if recurring_frequency = yearly number between 1 and 31
 * recurring_month: number between 1 and 12
 * recurring_interval: positive number
 * account_id: required
 * category_id: default to Uncategorized
 */
export const transactionSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  amount: z
    .number("Amount must be a number")
    .positive("Amount must be greater than 0"),
  description: z.string().optional(),
  date: z.string().regex(/\d{4}-\d{2}-\d{2}/gm),
  type: z.enum(["income", "expense"], "Type must be either income or expense"),
  recurring_frequency: z
    .enum(
      ["daily", "weekly", "monthly", "yearly"],
      "Please select a recurring frequency",
    )
    .optional()
    .nullable(),
  recurring_day: z.number().optional().nullable(),
  recurring_month: z.number().optional().nullable(),
  recurring_interval: z.number().optional().nullable(),
  account_id: z.number("Account id must be provided").min(1),
  category_id: z
    .number("Category id must be provided")
    .min(1)
    .nullable()
    .default(1),
});

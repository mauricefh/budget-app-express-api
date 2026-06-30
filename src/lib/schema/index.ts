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
  type: z.enum(accountTypeEnum, "Account type is required"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
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
let message = "";
export const transactionSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().nullish(),
    amount: z
      .number("Amount must be a number")
      .positive("Amount must be greater than 0"),
    date: z.string().regex(/\d{4}-\d{2}-\d{2}/gm),
    type: z.enum(transactionTypeEnum, "Type must be either income or expense"),
    account_id: z.number("Account id required").min(1),
    category_id: z.number("Category is required").min(1).default(1).nullish(),
    recurring_frequency: z
      .enum(
        transactionRecurringFrequencyEnum,
        "Please select a recurring frequency",
      )
      .nullish(),
    recurring_day: z.number().nullish(),
    recurring_month: z.number().nullish(),
    recurring_interval: z.number().nullish(),
  })
  .refine(
    (data) => {
      if (data.recurring_frequency === "weekly") {
        if (
          data.recurring_day &&
          data.recurring_day >= 1 &&
          data.recurring_day <= 7
        ) {
          message =
            "Recurring day must be between monday and sunday when recurring frequency is weekly";
        }
      } else if (data.recurring_frequency === "monthly") {
        if (
          data.recurring_day &&
          data.recurring_day >= 1 &&
          data.recurring_day <= 31
        ) {
          message =
            "Recurring day must be between 1 and 31 when recurring frequency is monthly";
        }
      } else if (data.recurring_frequency === "yearly") {
        if (
          data.recurring_day &&
          data.recurring_day >= 1 &&
          data.recurring_day <= 31
        ) {
          message =
            "Recurring day must be between 1 and 31 when recurring frequency is yearly";
        }
        if (
          data.recurring_month &&
          data.recurring_month >= 1 &&
          data.recurring_month <= 12
        ) {
          message =
            "Recurring month must be selected when recurring frequency is yearly";
        }
      }
    },
    { error: message, path: ["recurring_frequency"] },
  );

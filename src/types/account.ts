import { Base } from "./base";
import { User } from "./user";

export type Account = Base & {
  name: string;
  type: "cash" | "chequing" | "saving" | "credit" | "loan";
  balance: number;
  user_id: number;
  user?: User;
};

export type CreateAccount = Omit<
  Account,
  "id" | "balance" | "created_at" | "user"
>;

export type UpdateAccount = Omit<Account, "balance" | "created_at" | "user"> & {
  name?: string;
  type?: "cash" | "chequing" | "saving" | "credit" | "loan";
};

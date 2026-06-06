import { Base } from "./base";
import { User } from "./user";

export type Account = Base & {
  name: string;
  type: "cash" | "checking" | "saving" | "credit" | "loan";
  user_id: number;
  user?: User;
};

export type CreateAccount = Omit<Account, "id" | "created_at" | "user">;

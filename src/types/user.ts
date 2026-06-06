import { Base } from "./base";

export type User = Base & {
  email: string;
};

export type UserWithCredentials = User & {
  password: string;
  salt: string;
};

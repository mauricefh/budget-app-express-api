export type User = {
  id: number;
  email: string;
};

export type UserWithCredentials = User & {
  password: string;
  salt: string;
};

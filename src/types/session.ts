export type Session = {
  id: number;
  token: string;
  expire_at: Date;
  user_id: number;
};

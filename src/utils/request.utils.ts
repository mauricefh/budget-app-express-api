import { Request } from "express";

export function getUserId(req: Request): number {
  const userId = req.user?.id;
  if (!userId) throw new Error("userId not found");

  return userId;
}

export function getParamId(req: Request): number {
  const id = Number(req.params?.id);
  if (!id || isNaN(id)) throw new Error("Invalid id");
  return id;
}

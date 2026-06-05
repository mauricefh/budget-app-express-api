import { NextFunction, Request, Response } from "express";
import { getSession } from "../services/session.service";
import { findUserById } from "../services/auth.service";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.session;
  if (!token)
    return res.status(401).json({ message: "Authentication required" });
  const session = getSession(token);
  if (!session)
    return res.status(401).json({ message: "Authentication required" });

  req.user = findUserById(session.user_id) ?? undefined;
  return next();
}

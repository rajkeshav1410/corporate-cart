import { db } from "@app/common";
import { NextFunction, Request, Response } from "express";

const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await db.user.findMany();
  res.status(200).json(users);
};

export { listUsers };

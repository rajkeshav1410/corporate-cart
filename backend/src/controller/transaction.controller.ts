import { db } from "@app/common";
import {
  TransactionFilter,
  TransactionFilterSchema,
  TransactionSearchMap,
} from "@app/model";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Fuse from "fuse.js";

export const getTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allUserTransaction = await db.transaction.findMany({
    where: {
      NOT: [{ buyer: null }],
      OR: [{ buyerId: req.user.id }, { sellerId: req.user.id }],
    },
    include: {
      buyer: {
        select: {
          avatar: true,
          name: true,
          id: true,
          email: true,
        },
      },
      seller: {
        select: {
          avatar: true,
          name: true,
          id: true,
          email: true,
        },
      },
      saleInventory: true,
      tradeInventory: true,
    },
  });

  if (Object.keys(req.body).length === 0)
    return res.status(StatusCodes.OK).json(allUserTransaction);

  const filter: TransactionFilter = TransactionFilterSchema.parse(req.body);

  let filteredUserTransaction: typeof allUserTransaction | null = null;

  if (filter.searchValue && filter.searchKey) {
    const fuseOptions = { keys: [TransactionSearchMap[filter.searchKey]] };
    console.log(filter.searchValue);
    console.log(fuseOptions);

    const fuse = new Fuse(allUserTransaction, fuseOptions);
    const fuzzyResults = fuse.search(filter.searchValue);
    filteredUserTransaction = fuzzyResults.map((result) => result.item);
  }

  filteredUserTransaction = (
    filteredUserTransaction ?? allUserTransaction
  ).filter((transaction) => {
    return (
      (!filter.type || transaction.type === filter.type) &&
      (filter.priceLower === -1 ||
        transaction.saleInventory.price >= filter.priceLower) &&
      (filter.priceHigher === -1 ||
        transaction.saleInventory.price <= filter.priceHigher) &&
      (!filter.date ||
        transaction.updatedAt.toLocaleDateString() === filter.date)
    );
  });

  res.status(StatusCodes.OK).json(filteredUserTransaction);
};

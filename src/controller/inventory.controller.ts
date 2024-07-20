import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { db, throwError } from "../common";
import {
  CreateInventoryRequest,
  CreateInventoryRequestShema,
  UpdateInventoryRequest,
  UpdateInventoryRequestShema,
} from "../model";
import {
  Inventory,
  Transaction,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";

export const createInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const createInventoryRequest: CreateInventoryRequest =
    CreateInventoryRequestShema.parse(req.body);
  const { id, ...newInventory } = await db.inventory.create({
    data: {
      ...createInventoryRequest,
      userId: req.user.id,
    },
  });

  res.status(StatusCodes.OK).json(newInventory);
};

export const updateInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const updateInventoryRequest: UpdateInventoryRequest =
    UpdateInventoryRequestShema.parse(req.body);

  const existingInventory = await db.inventory.findFirst({
    where: {
      id: req.params.inventoryId,
    },
  });

  if (!existingInventory)
    return throwError(
      `Inventory with id ${req.params.inventoryId} does not exist`,
      StatusCodes.BAD_REQUEST,
      next
    );

  if (existingInventory.userId !== req.user.id)
    return throwError(
      `Inventory does not belong to user`,
      StatusCodes.BAD_REQUEST,
      next
    );

  const { id, ...updatedInventory } = await db.inventory.update({
    where: {
      id: req.params.inventoryId,
    },
    data: {
      itemName:
        updateInventoryRequest.itemName?.trim() ||
        updateInventoryRequest.itemName,
      itemDescription:
        updateInventoryRequest.itemDescription?.trim() ||
        updateInventoryRequest.itemDescription,
      price: updateInventoryRequest.price || updateInventoryRequest.price,
    },
  });

  res.status(StatusCodes.OK).json(updatedInventory);
};

export const getInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userInventory = await db.inventory.findMany({
    where: {
      userId: req.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(StatusCodes.OK).json(userInventory);
};

export const getInventoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const inventory = await db.inventory.findFirst({
    where: {
      id: req.params.inventoryId,
    },
  });

  if (!inventory)
    return throwError(
      `Inventory with id ${req.params.inventoryId} does not exist`,
      StatusCodes.BAD_REQUEST,
      next
    );

  res.status(StatusCodes.OK).json(inventory);
};

// export const deleteInventory = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};

export const getStore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const saleInventories = await db.transaction.findMany({
    where: {
      buyer: null,
    },
    select: {
      saleInventory: true,
    },
  });
  res.status(StatusCodes.OK).json(saleInventories.map((x) => x.saleInventory));
};

export const sellInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const saleInventoryId = req.params.inventoryId;

  const existingTransaction = await db.transaction.findFirst({
    where: {
      saleInventoryId,
    },
  });

  if (existingTransaction)
    return throwError(`Item already on sale`, StatusCodes.BAD_REQUEST, next);

  const newTransaction = await db.transaction.create({
    data: {
      status: TransactionStatus.ONSALE,
      type: TransactionType.SALE_BUY,
      sellerId: req.user.id,
      saleInventoryId,
    },
  });
  res.status(StatusCodes.OK).json(newTransaction);
};

export const buyInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const saleInventoryId = req.params.inventoryId;
  const existingInventory = await db.inventory.findFirst({
    where: {
      id: saleInventoryId,
    },
  });

  if (!existingInventory)
    return throwError(
      `Inventory with id ${req.params.inventoryId} does not exist`,
      StatusCodes.BAD_REQUEST,
      next
    );

  if (existingInventory.userId === req.user.id)
    return throwError(
      `User cannot buy there listed goods`,
      StatusCodes.BAD_REQUEST,
      next
    );

  const onSaleTransaction = await db.transaction.findFirst({
    where: {
      AND: [
        {
          saleInventoryId,
        },
        {
          buyer: null,
        },
      ],
    },
  });

  if (!onSaleTransaction)
    return throwError(
      `Inventory not listed OnSale`,
      StatusCodes.BAD_REQUEST,
      next
    );

  const [updatedTransaction] = await db.$transaction([
    db.transaction.update({
      where: {
        id: onSaleTransaction.id,
      },
      data: {
        buyerId: req.user.id,
        coin: existingInventory.price,
        status: TransactionStatus.COMPLETED,
      },
    }),
    db.inventory.create({
      data: {
        itemName: existingInventory.itemName,
        itemDescription: existingInventory.itemDescription,
        price: existingInventory.price,
        userId: req.user.id,
      },
    }),
    db.inventory.update({
      where: {
        id: existingInventory.id,
      },
      data: {
        userId: null,
      },
    }),
  ]);

  res.status(StatusCodes.OK).json(updatedTransaction);
};

export const tradeInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(StatusCodes.OK).json({});
};

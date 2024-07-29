import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
import * as fs from "node:fs";
import {
  CreateInventoryRequest,
  CreateInventoryRequestShema,
  UpdateInventoryRequest,
  UpdateInventoryRequestShema,
  UserInventoryResponse,
} from "@app/model";
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import { db, throwError } from "@app/common";

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
        updateInventoryRequest.itemName?.trim() || existingInventory.itemName,
      itemDescription:
        updateInventoryRequest.itemDescription?.trim() ||
        existingInventory.itemDescription,
      price: updateInventoryRequest.price || existingInventory.price,
      category: updateInventoryRequest.category || existingInventory.category,
      inventoryImageId:
        updateInventoryRequest.inventoryImageId ||
        existingInventory.inventoryImageId,
    },
  });

  res.status(StatusCodes.OK).json(updatedInventory);
};

export const deleteInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  const deletedInventory = await db.inventory.delete({
    where: {
      id: req.params.inventoryId,
    },
  });

  if (existingInventory.inventoryImageId) {
    const imagePath = path.join(
      __dirname,
      "../../uploads",
      existingInventory.inventoryImageId
    );
    fs.unlinkSync(imagePath);
  }

  res.status(StatusCodes.OK).json(deletedInventory);
};

export const getInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userInventoryList = await db.inventory.findMany({
    where: {
      userId: req.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      saleTransaction: true,
    },
  });

  const userInventoryResponse: UserInventoryResponse[] = userInventoryList.map(
    (inventory) => {
      return {
        onSale: !!inventory.saleTransaction.length,
        ...inventory,
      };
    }
  );

  res.status(StatusCodes.OK).json(userInventoryResponse);
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

  const existingInventory = await db.inventory.findFirst({
    where: {
      id: saleInventoryId,
    },
  });

  if (!existingInventory)
    return throwError(`Item not found`, StatusCodes.BAD_REQUEST, next);

  const newTransaction: Transaction = await db.transaction.create({
    data: {
      status: TransactionStatus.ONSALE,
      type: TransactionType.SALE_BUY,
      sellerId: req.user.id,
      saleInventoryId,
      coin: existingInventory.price,
    },
  });

  res.status(StatusCodes.OK).json(newTransaction);
};

export const archiveInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(StatusCodes.OK).json({});
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

  const buyerBalance = await db.user.findFirst({
    where: {
      id: req.user.id,
    },
    select: {
      coin: true,
    },
  });

  if (buyerBalance && buyerBalance.coin < existingInventory.price)
    return throwError(
      `Don't have enough balance`,
      StatusCodes.BAD_REQUEST,
      next
    );

  if (!existingInventory.userId)
    return throwError(`Item not for sale`, StatusCodes.BAD_REQUEST, next);

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
        category: existingInventory.category,
        inventoryImageId: existingInventory.inventoryImageId,
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
    db.user.update({
      where: {
        id: existingInventory.userId,
      },
      data: {
        coin: {
          increment: existingInventory.price,
        },
      },
    }),
    db.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        coin: {
          decrement: existingInventory.price,
        },
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

export const uploadInventoryImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(StatusCodes.OK).json({});
};

export const getInventoryImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imagePath = path.join(
    __dirname,
    "../../uploads",
    req.params.inventoryImageId
  );

  const defImagePath = path.join(__dirname, "../../uploads", "wallpaper");

  if (!fs.existsSync(imagePath))
    res.status(StatusCodes.OK).sendFile(defImagePath);
  else res.status(StatusCodes.OK).sendFile(imagePath);
};

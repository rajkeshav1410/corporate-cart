"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInventoryImage = exports.uploadInventoryImage = exports.tradeInventory = exports.buyInventory = exports.archiveInventory = exports.sellInventory = exports.getStore = exports.getInventoryById = exports.getInventory = exports.deleteInventory = exports.updateInventory = exports.createInventory = void 0;
const http_status_codes_1 = require("http-status-codes");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("node:fs"));
const model_1 = require("@app/model");
const client_1 = require("@prisma/client");
const common_1 = require("@app/common");
const createInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const createInventoryRequest = model_1.CreateInventoryRequestShema.parse(req.body);
    const _a = yield common_1.db.inventory.create({
        data: Object.assign(Object.assign({}, createInventoryRequest), { userId: req.user.id }),
    }), { id } = _a, newInventory = __rest(_a, ["id"]);
    res.status(http_status_codes_1.StatusCodes.OK).json(newInventory);
});
exports.createInventory = createInventory;
const updateInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const updateInventoryRequest = model_1.UpdateInventoryRequestShema.parse(req.body);
    const existingInventory = yield common_1.db.inventory.findFirst({
        where: {
            id: req.params.inventoryId,
        },
    });
    if (!existingInventory)
        return (0, common_1.throwError)(`Inventory with id ${req.params.inventoryId} does not exist`, http_status_codes_1.StatusCodes.BAD_REQUEST, next);
    if (existingInventory.userId !== req.user.id)
        return (0, common_1.throwError)(`Inventory does not belong to user`, http_status_codes_1.StatusCodes.BAD_REQUEST, next);
    const _c = yield common_1.db.inventory.update({
        where: {
            id: req.params.inventoryId,
        },
        data: {
            itemName: ((_a = updateInventoryRequest.itemName) === null || _a === void 0 ? void 0 : _a.trim()) || existingInventory.itemName,
            itemDescription: ((_b = updateInventoryRequest.itemDescription) === null || _b === void 0 ? void 0 : _b.trim()) ||
                existingInventory.itemDescription,
            price: updateInventoryRequest.price || existingInventory.price,
            category: updateInventoryRequest.category || existingInventory.category,
            inventoryImageId: updateInventoryRequest.inventoryImageId ||
                existingInventory.inventoryImageId,
        },
    }), { id } = _c, updatedInventory = __rest(_c, ["id"]);
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedInventory);
});
exports.updateInventory = updateInventory;
const deleteInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const existingInventory = yield common_1.db.inventory.findFirst({
        where: {
            id: req.params.inventoryId,
        },
    });
    if (!existingInventory)
        return (0, common_1.throwError)(`Inventory with id ${req.params.inventoryId} does not exist`, http_status_codes_1.StatusCodes.BAD_REQUEST, next);
    if (existingInventory.userId !== req.user.id)
        return (0, common_1.throwError)(`Inventory does not belong to user`, http_status_codes_1.StatusCodes.BAD_REQUEST, next);
    const deletedInventory = yield common_1.db.inventory.delete({
        where: {
            id: req.params.inventoryId,
        },
    });
    if (existingInventory.inventoryImageId) {
        const imagePath = path_1.default.join(__dirname, "../../uploads", existingInventory.inventoryImageId);
        fs.unlinkSync(imagePath);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json(deletedInventory);
});
exports.deleteInventory = deleteInventory;
const getInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userInventoryList = yield common_1.db.inventory.findMany({
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
    const userInventoryResponse = userInventoryList.map((inventory) => {
        return Object.assign({ onSale: !!inventory.saleTransaction.length }, inventory);
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(userInventoryResponse);
});
exports.getInventory = getInventory;
const getInventoryById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const inventory = yield common_1.db.inventory.findFirst({
        where: {
            id: req.params.inventoryId,
        },
    });
    if (!inventory)
        return (0, common_1.throwError)(`Inventory with id ${req.params.inventoryId} does not exist`, http_status_codes_1.StatusCodes.BAD_REQUEST, next);
    res.status(http_status_codes_1.StatusCodes.OK).json(inventory);
});
exports.getInventoryById = getInventoryById;
// export const deleteInventory = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};
const getStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const saleInventories = yield common_1.db.transaction.findMany({
        where: {
            buyer: null,
        },
        select: {
            saleInventory: true,
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(saleInventories.map((x) => x.saleInventory));
});
exports.getStore = getStore;
const sellInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const saleInventoryId = req.params.inventoryId;
    const existingTransaction = yield common_1.db.transaction.findFirst({
        where: {
            saleInventoryId,
        },
    });
    if (existingTransaction)
        return (0, common_1.throwError)(`Item already on sale`, http_status_codes_1.StatusCodes.BAD_REQUEST, next);
    const existingInventory = yield common_1.db.inventory.findFirst({
        where: {
            id: saleInventoryId,
        },
    });
    if (!existingInventory)
        return (0, common_1.throwError)(`Item not found`, http_status_codes_1.StatusCodes.BAD_REQUEST, next);
    const newTransaction = yield common_1.db.transaction.create({
        data: {
            status: client_1.TransactionStatus.ONSALE,
            type: client_1.TransactionType.SALE_BUY,
            sellerId: req.user.id,
            saleInventoryId,
            coin: existingInventory.price,
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(newTransaction);
});
exports.sellInventory = sellInventory;
const archiveInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json({});
});
exports.archiveInventory = archiveInventory;
const buyInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const saleInventoryId = req.params.inventoryId;
    const existingInventory = yield common_1.db.inventory.findFirst({
        where: {
            id: saleInventoryId,
        },
    });
    if (!existingInventory)
        return (0, common_1.throwError)(`Inventory with id ${req.params.inventoryId} does not exist`, http_status_codes_1.StatusCodes.BAD_REQUEST, next);
    const buyerBalance = yield common_1.db.user.findFirst({
        where: {
            id: req.user.id,
        },
        select: {
            coin: true,
        },
    });
    if (buyerBalance && buyerBalance.coin < existingInventory.price)
        return (0, common_1.throwError)(`Don't have enough balance`, http_status_codes_1.StatusCodes.BAD_REQUEST, next);
    if (!existingInventory.userId)
        return (0, common_1.throwError)(`Item not for sale`, http_status_codes_1.StatusCodes.BAD_REQUEST, next);
    if (existingInventory.userId === req.user.id)
        return (0, common_1.throwError)(`User cannot buy there listed goods`, http_status_codes_1.StatusCodes.BAD_REQUEST, next);
    const onSaleTransaction = yield common_1.db.transaction.findFirst({
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
        return (0, common_1.throwError)(`Inventory not listed OnSale`, http_status_codes_1.StatusCodes.BAD_REQUEST, next);
    const [updatedTransaction] = yield common_1.db.$transaction([
        common_1.db.transaction.update({
            where: {
                id: onSaleTransaction.id,
            },
            data: {
                buyerId: req.user.id,
                coin: existingInventory.price,
                status: client_1.TransactionStatus.COMPLETED,
            },
        }),
        common_1.db.inventory.create({
            data: {
                itemName: existingInventory.itemName,
                itemDescription: existingInventory.itemDescription,
                price: existingInventory.price,
                userId: req.user.id,
                category: existingInventory.category,
                inventoryImageId: existingInventory.inventoryImageId,
            },
        }),
        common_1.db.inventory.update({
            where: {
                id: existingInventory.id,
            },
            data: {
                userId: null,
            },
        }),
        common_1.db.user.update({
            where: {
                id: existingInventory.userId,
            },
            data: {
                coin: {
                    increment: existingInventory.price,
                },
            },
        }),
        common_1.db.user.update({
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
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedTransaction);
});
exports.buyInventory = buyInventory;
const tradeInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json({});
});
exports.tradeInventory = tradeInventory;
const uploadInventoryImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json({});
});
exports.uploadInventoryImage = uploadInventoryImage;
const getInventoryImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const imagePath = path_1.default.join(__dirname, "../../uploads", req.params.inventoryImageId);
    const defImagePath = path_1.default.join(__dirname, "../../uploads", "wallpaper");
    if (!fs.existsSync(imagePath))
        res.status(http_status_codes_1.StatusCodes.OK).sendFile(defImagePath);
    else
        res.status(http_status_codes_1.StatusCodes.OK).sendFile(imagePath);
});
exports.getInventoryImage = getInventoryImage;
//# sourceMappingURL=inventory.controller.js.map
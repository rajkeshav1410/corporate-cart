"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSearchMap = exports.TransactionFilterSchema = void 0;
const zod_1 = require("zod");
exports.TransactionFilterSchema = zod_1.z.object({
    type: zod_1.z.enum(["SALE_BUY", "TRADE", ""]),
    searchKey: zod_1.z.enum(["itemTitle", "sellerName", "buyerName", ""]),
    searchValue: zod_1.z.string(),
    priceLower: zod_1.z.number(),
    priceHigher: zod_1.z.number(),
    date: zod_1.z.string(),
});
exports.TransactionSearchMap = {
    itemTitle: "saleInventory.itemName",
    sellerName: "seller.name",
    buyerName: "buyer.name",
};
//# sourceMappingURL=transaction.model.js.map
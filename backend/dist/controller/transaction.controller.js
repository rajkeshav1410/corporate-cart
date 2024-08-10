"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransaction = void 0;
const common_1 = require("@app/common");
const model_1 = require("@app/model");
const http_status_codes_1 = require("http-status-codes");
const fuse_js_1 = __importDefault(require("fuse.js"));
const getTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allUserTransaction = yield common_1.db.transaction.findMany({
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
        return res.status(http_status_codes_1.StatusCodes.OK).json(allUserTransaction);
    const filter = model_1.TransactionFilterSchema.parse(req.body);
    let filteredUserTransaction = null;
    if (filter.searchValue && filter.searchKey) {
        const fuseOptions = { keys: [model_1.TransactionSearchMap[filter.searchKey]] };
        console.log(filter.searchValue);
        console.log(fuseOptions);
        const fuse = new fuse_js_1.default(allUserTransaction, fuseOptions);
        const fuzzyResults = fuse.search(filter.searchValue);
        filteredUserTransaction = fuzzyResults.map((result) => result.item);
    }
    filteredUserTransaction = (filteredUserTransaction !== null && filteredUserTransaction !== void 0 ? filteredUserTransaction : allUserTransaction).filter((transaction) => {
        return ((!filter.type || transaction.type === filter.type) &&
            (filter.priceLower === -1 ||
                transaction.saleInventory.price >= filter.priceLower) &&
            (filter.priceHigher === -1 ||
                transaction.saleInventory.price <= filter.priceHigher) &&
            (!filter.date ||
                transaction.updatedAt.toLocaleDateString() === filter.date));
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(filteredUserTransaction);
});
exports.getTransaction = getTransaction;
//# sourceMappingURL=transaction.controller.js.map
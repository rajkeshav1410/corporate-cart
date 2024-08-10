"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInventoryRequestShema = exports.CreateInventoryRequestShema = void 0;
const zod_1 = require("zod");
const CreateInventoryRequestShema = zod_1.z.object({
    itemName: zod_1.z.string(),
    itemDescription: zod_1.z.string(),
    price: zod_1.z.number(),
    category: zod_1.z.string(),
    inventoryImageId: zod_1.z.string(),
});
exports.CreateInventoryRequestShema = CreateInventoryRequestShema;
const UpdateInventoryRequestShema = zod_1.z.object({
    itemName: zod_1.z.string().optional(),
    itemDescription: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
    category: zod_1.z.string().optional(),
    inventoryImageId: zod_1.z.string().optional(),
});
exports.UpdateInventoryRequestShema = UpdateInventoryRequestShema;
//# sourceMappingURL=inventory.model.js.map
import { Inventory } from "@prisma/client";
import { z } from "zod";

const CreateInventoryRequestShema = z.object({
  itemName: z.string(),
  itemDescription: z.string(),
  price: z.number(),
  category: z.string(),
  inventoryImageId: z.string(),
});

type CreateInventoryRequest = z.infer<typeof CreateInventoryRequestShema>;

const UpdateInventoryRequestShema = z.object({
  itemName: z.string().optional(),
  itemDescription: z.string().optional(),
  price: z.number().optional(),
  category: z.string().optional(),
  inventoryImageId: z.string().optional(),
});

type UpdateInventoryRequest = z.infer<typeof UpdateInventoryRequestShema>;

export interface UserInventoryResponse extends Inventory {
  onSale: boolean;
}

export {
  CreateInventoryRequest,
  CreateInventoryRequestShema,
  UpdateInventoryRequest,
  UpdateInventoryRequestShema,
};

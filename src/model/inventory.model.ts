import { z } from "zod";

const CreateInventoryRequestShema = z.object({
  itemName: z.string(),
  itemDescription: z.string(),
  price: z.number(),
});

type CreateInventoryRequest = z.infer<typeof CreateInventoryRequestShema>;

const UpdateInventoryRequestShema = z.object({
  itemName: z.string().optional(),
  itemDescription: z.string().optional(),
  price: z.number().optional(),
});

type UpdateInventoryRequest = z.infer<typeof UpdateInventoryRequestShema>;

export {
  CreateInventoryRequest,
  CreateInventoryRequestShema,
  UpdateInventoryRequest,
  UpdateInventoryRequestShema,
};

export interface UserInventory {
  id: string;
  itemName: string;
  itemDescription: string;
  price: number;
  userId: string;
  inventoryImageId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInventoryRequest {
  itemName: string;
  itemDescription: string;
  price: number;
}

export interface UpdateInventoryRequest {
  itemName?: string;
  itemDescription?: string;
  price?: number;
}

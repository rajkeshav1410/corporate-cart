export interface UserInventory {
  id: string;
  itemName: string;
  itemDescription: string;
  price: number;
  category: string;
  userId: string;
  inventoryImageId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryData extends UserInventory {
  action: Action;
}

export interface CreateInventoryRequest {
  itemName: string;
  itemDescription: string;
  price: number;
  category: string;
  inventoryImageId: string;
}

export enum Action {
  ADD,
  EDIT,
  DELETE,
}

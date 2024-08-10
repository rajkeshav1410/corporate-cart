import { UserInventory } from './inventory.model';
import { AuthUser } from './user.model';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  coin: number;
  sellerId: string;
  buyerId: string;
  saleInventoryId: string;
  tradeInventoryId: string | null;
  createdAt: string;
  updatedAt: string;
  buyer: AuthUser;
  seller: AuthUser;
  saleInventory: UserInventory;
  tradeInventory: UserInventory | null;
}

export interface TransactionTableView {
  transaction: Transaction;
  type: string;
  date: string;
  item: string;
  buyer: string;
  seller: string;
  price: string;
  status: string;
}

export enum TransactionType {
  SALE_BUY,
  TRADE,
}

export enum TransactionStatus {
  ONSALE,
  PENDING,
  COMPLETED,
  REJECTED,
}

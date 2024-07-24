export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  coin?: number;
  sellerId: string;
  buyerId?: string;
  saleInventoryId: string;
  tradeInventoryId?: string;
  createdAt: Date;
  updatedAt: Date;
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

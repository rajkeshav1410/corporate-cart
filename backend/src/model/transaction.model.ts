import { z } from "zod";

export const TransactionFilterSchema = z.object({
  type: z.enum(["SALE_BUY", "TRADE", ""]),
  searchKey: z.enum(["itemTitle", "sellerName", "buyerName", ""]),
  searchValue: z.string(),
  priceLower: z.number(),
  priceHigher: z.number(),
  date: z.string(),
});

export type TransactionFilter = z.infer<typeof TransactionFilterSchema>;

export const TransactionSearchMap = {
  itemTitle: "saleInventory.itemName",
  sellerName: "seller.name",
  buyerName: "buyer.name",
};

export type SearchType = { [key: string]: string };

export interface FuseKeyType {
  name: string;
  weight: number;
}

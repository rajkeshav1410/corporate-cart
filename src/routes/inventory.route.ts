import { authenticate, isAuthenticated } from "../middleware/auth.middleware";
import withErrorHandling from "../middleware/handleAsync";
import {
  buyInventory,
  createInventory,
  // deleteInventory,
  getInventory,
  getInventoryById,
  getStore,
  sellInventory,
  tradeInventory,
  updateInventory,
} from "../controller";

const express = require("express");
export const inventoryRouter = express.Router();

inventoryRouter.route("/store").get(withErrorHandling(getStore));
inventoryRouter
  .route("/create")
  .post(authenticate, withErrorHandling(createInventory));
inventoryRouter
  .route("/update/:inventoryId")
  .post(authenticate, withErrorHandling(updateInventory));
inventoryRouter.route("/").get(authenticate, withErrorHandling(getInventory));
inventoryRouter.route("/:inventoryId").get(withErrorHandling(getInventoryById));
// inventoryRouter
//   .route("/:inventoryId")
//   .get(isAuthenticated, withErrorHandling(getInventoryById));
// inventoryRouter
//   .route("/delete/:inventoryId")
//   .post(authenticate, withErrorHandling(deleteInventory));
inventoryRouter
  .route("/sell/:inventoryId")
  .post(authenticate, withErrorHandling(sellInventory));
inventoryRouter
  .route("/buy/:inventoryId")
  .post(authenticate, withErrorHandling(buyInventory));
inventoryRouter
  .route("/trade/:inventoryId/:tradeInventoryId")
  .post(authenticate, withErrorHandling(tradeInventory));

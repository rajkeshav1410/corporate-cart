import {
  getStore,
  createInventory,
  updateInventory,
  deleteInventory,
  getInventory,
  getInventoryById,
  sellInventory,
  buyInventory,
  tradeInventory,
  uploadInventoryImage,
  getInventoryImage,
  archiveInventory,
} from "@app/controller";
import { authenticate, uploadImage, withErrorHandling } from "@app/middleware";

const express = require("express");
export const inventoryRouter = express.Router();

inventoryRouter.route("/store").get(withErrorHandling(getStore));

inventoryRouter
  .route("/create")
  .post(authenticate, withErrorHandling(createInventory));

inventoryRouter
  .route("/update/:inventoryId")
  .post(authenticate, withErrorHandling(updateInventory));

inventoryRouter
  .route("/delete/:inventoryId")
  .post(authenticate, withErrorHandling(deleteInventory));

inventoryRouter.route("/").get(authenticate, withErrorHandling(getInventory));

inventoryRouter.route("/:inventoryId").get(withErrorHandling(getInventoryById));

inventoryRouter
  .route("/sell/:inventoryId")
  .post(authenticate, withErrorHandling(sellInventory));

inventoryRouter
  .route("/archive/:inventoryId")
  .post(authenticate, withErrorHandling(archiveInventory));

inventoryRouter
  .route("/buy/:inventoryId")
  .post(authenticate, withErrorHandling(buyInventory));

inventoryRouter
  .route("/trade/:inventoryId/:tradeInventoryId")
  .post(authenticate, withErrorHandling(tradeInventory));

inventoryRouter
  .route("/upload")
  .post(authenticate, uploadImage, withErrorHandling(uploadInventoryImage));

inventoryRouter
  .route("/image/:inventoryImageId")
  .get(withErrorHandling(getInventoryImage));

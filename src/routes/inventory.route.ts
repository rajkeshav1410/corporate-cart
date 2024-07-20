import { authenticate } from "../middleware/auth.middleware";
import withErrorHandling from "../middleware/handleAsync";
import {
  createInventory,
  deleteInventory,
  getInventory,
  getInventoryById,
  getStore,
  updateInventory,
} from "../controller";

const express = require("express");
export const inventoryRouter = express.Router();

inventoryRouter.route("/create").post(withErrorHandling(createInventory));
inventoryRouter.route("/update").post(withErrorHandling(updateInventory));
inventoryRouter.route("/").get(authenticate, withErrorHandling(getInventory));
inventoryRouter.route("/:inventoryId").get(withErrorHandling(getInventoryById));
inventoryRouter
  .route("/delete/:inventoryId")
  .post(authenticate, withErrorHandling(deleteInventory));
inventoryRouter.route("/store").get(withErrorHandling(getStore));

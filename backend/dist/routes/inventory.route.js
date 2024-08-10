"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryRouter = void 0;
const controller_1 = require("@app/controller");
const middleware_1 = require("@app/middleware");
const express = require("express");
exports.inventoryRouter = express.Router();
exports.inventoryRouter.route("/store").get((0, middleware_1.withErrorHandling)(controller_1.getStore));
exports.inventoryRouter
    .route("/create")
    .post(middleware_1.authenticate, (0, middleware_1.withErrorHandling)(controller_1.createInventory));
exports.inventoryRouter
    .route("/update/:inventoryId")
    .post(middleware_1.authenticate, (0, middleware_1.withErrorHandling)(controller_1.updateInventory));
exports.inventoryRouter
    .route("/delete/:inventoryId")
    .post(middleware_1.authenticate, (0, middleware_1.withErrorHandling)(controller_1.deleteInventory));
exports.inventoryRouter.route("/").get(middleware_1.authenticate, (0, middleware_1.withErrorHandling)(controller_1.getInventory));
exports.inventoryRouter.route("/:inventoryId").get((0, middleware_1.withErrorHandling)(controller_1.getInventoryById));
exports.inventoryRouter
    .route("/sell/:inventoryId")
    .post(middleware_1.authenticate, (0, middleware_1.withErrorHandling)(controller_1.sellInventory));
exports.inventoryRouter
    .route("/archive/:inventoryId")
    .post(middleware_1.authenticate, (0, middleware_1.withErrorHandling)(controller_1.archiveInventory));
exports.inventoryRouter
    .route("/buy/:inventoryId")
    .post(middleware_1.authenticate, (0, middleware_1.withErrorHandling)(controller_1.buyInventory));
exports.inventoryRouter
    .route("/trade/:inventoryId/:tradeInventoryId")
    .post(middleware_1.authenticate, (0, middleware_1.withErrorHandling)(controller_1.tradeInventory));
exports.inventoryRouter
    .route("/upload")
    .post(middleware_1.authenticate, middleware_1.uploadImage, (0, middleware_1.withErrorHandling)(controller_1.uploadInventoryImage));
exports.inventoryRouter
    .route("/image/:inventoryImageId")
    .get((0, middleware_1.withErrorHandling)(controller_1.getInventoryImage));
//# sourceMappingURL=inventory.route.js.map
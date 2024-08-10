"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRouter = void 0;
const controller_1 = require("@app/controller");
const middleware_1 = require("@app/middleware");
const express = require("express");
exports.transactionRouter = express.Router();
exports.transactionRouter
    .route("/")
    .post(middleware_1.authenticate, (0, middleware_1.withErrorHandling)(controller_1.getTransaction));
//# sourceMappingURL=transaction.route.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const controller_1 = require("@app/controller");
const middleware_1 = require("@app/middleware");
const express = require("express");
exports.userRoute = express.Router();
exports.userRoute
    .route("/getAllUsers")
    .get(middleware_1.authenticate, middleware_1.isAdmin, (0, middleware_1.withErrorHandling)(controller_1.listUsers));
//# sourceMappingURL=user.route.js.map
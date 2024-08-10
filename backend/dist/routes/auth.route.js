"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const controller_1 = require("@app/controller");
const middleware_1 = require("@app/middleware");
const express = require("express");
exports.authRoute = express.Router();
exports.authRoute.route("/signup").post((0, middleware_1.withErrorHandling)(controller_1.signup));
exports.authRoute.route("/login").post((0, middleware_1.withErrorHandling)(controller_1.login));
exports.authRoute.route("/track").get(middleware_1.isAuthenticated, (0, middleware_1.withErrorHandling)(controller_1.me));
exports.authRoute.route("/logout").post(middleware_1.authenticate, (0, middleware_1.withErrorHandling)(controller_1.logout));
//# sourceMappingURL=auth.route.js.map
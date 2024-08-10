"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const common_1 = require("@app/common");
const middleware_1 = require("@app/middleware");
const routes_1 = require("@app/routes");
const app = (0, express_1.default)();
const url = `${process.env.BASE_URL}:${process.env.PORT}`;
const corsOptions = {
    origin: "*",
};
app.set("trust proxy", true);
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(middleware_1.apiLogger);
// app.use("/api/v1/admin", authenticate, isAdmin, adminRoute);
app.use("/api/v1/user", routes_1.userRoute);
app.use("/api/v1/auth", routes_1.authRoute);
app.use("/api/v1/inventory", routes_1.inventoryRouter);
app.use("/api/v1/transaction", routes_1.transactionRouter);
app.use(middleware_1.errorHandler);
// start the server
app.listen(parseInt(process.env.PORT || "8081", 10), process.env.BASE_URL || "localhost", () => {
    common_1.logger.info(`Server running: ${url}`);
});
//# sourceMappingURL=server.js.map
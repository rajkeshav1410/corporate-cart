"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = exports.authenticate = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const common_1 = require("@app/common");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies.jwt)
        return next({
            message: "You need to login first",
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
        });
    const token = req.cookies.jwt.trim();
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        if (!decoded.id ||
            decoded.reqIP !== req.ip ||
            decoded.agent !== req.headers["user-agent"])
            return next({
                message: "Invalid JWT token",
                statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            });
        const user = yield common_1.db.user.findFirst({
            where: {
                id: decoded.id,
            },
        });
        if (!user)
            return next({
                message: "User not found",
                statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            });
        req.user = user;
        next();
    }
    catch (error) {
        next({
            message: error instanceof jsonwebtoken_1.default.TokenExpiredError
                ? "Token has expired"
                : "You need to login",
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
        });
    }
});
exports.authenticate = authenticate;
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let authenticated = false;
    try {
        if (req.cookies.jwt) {
            const token = req.cookies.jwt.trim();
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
            if (decoded.id &&
                decoded.reqIP === req.ip &&
                decoded.agent === req.headers["user-agent"]) {
                const user = yield common_1.db.user.findFirst({
                    where: { id: decoded.id },
                });
                if (user) {
                    authenticated = true;
                    req.user = user;
                }
            }
        }
        req.isAuthenticated = authenticated;
        next();
    }
    catch (error) {
        req.isAuthenticated = false;
        next();
    }
});
exports.isAuthenticated = isAuthenticated;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user && req.user.role === client_1.Role.ADMIN) {
        next();
    }
    else {
        return next({
            message: "You do not have permission to access this route",
            statusCode: http_status_codes_1.StatusCodes.FORBIDDEN,
        });
    }
});
exports.isAdmin = isAdmin;
//# sourceMappingURL=auth.middleware.js.map
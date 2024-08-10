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
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiLogger = void 0;
const common_1 = require("../common");
const apiLogger = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    common_1.logger.info(`${req.method} ${req.url}${Object.keys(req.params).length > 0
        ? "\nParams: " + JSON.stringify(req.params)
        : ""}${Object.keys(req.body).length > 0
        ? "\nBody: " + JSON.stringify(req.body)
        : ""}`);
    next();
});
exports.apiLogger = apiLogger;
//# sourceMappingURL=logger.middleware.js.map
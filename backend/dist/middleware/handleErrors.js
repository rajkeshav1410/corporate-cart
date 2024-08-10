"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const common_1 = require("../common");
const errorHandler = (err, req, res, next) => {
    let message = err.message || (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    let statusCode = err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    // Handle Zod validation errors
    if (err instanceof zod_1.ZodError) {
        statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST; // Bad Request status code for validation errors
        message = err.errors
            .map((error) => {
            return `${error.path.join(".")} ${error.message}`;
        })
            .join("; ");
    }
    common_1.logger.error(`${statusCode} ${(0, http_status_codes_1.getReasonPhrase)(statusCode)} | ${message}`);
    res.status(statusCode).json({ success: "false", message });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=handleErrors.js.map
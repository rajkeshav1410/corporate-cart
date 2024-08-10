"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPTY_STRING = exports.RegexPatterns = void 0;
exports.RegexPatterns = {
    GSTIN: /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}/,
    PASSWORD: /^(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+\\|[\]{};:'",.<>/?])(?=.*[0-9]).{6,}$/,
};
exports.EMPTY_STRING = "";
//# sourceMappingURL=constants.js.map
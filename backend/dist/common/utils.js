"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanAlphanumericSort = exports.throwError = void 0;
const throwError = (message, statusCode, next) => {
    return next({ message, statusCode });
};
exports.throwError = throwError;
const cleanAlphanumericSort = (a, b) => {
    // Remove non-alphanumeric characters from strings for comparison
    const cleanA = a.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const cleanB = b.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    // Compare the cleaned strings
    return cleanA.localeCompare(cleanB);
};
exports.cleanAlphanumericSort = cleanAlphanumericSort;
//# sourceMappingURL=utils.js.map
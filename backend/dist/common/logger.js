"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const fs_1 = require("fs");
const timezoned = () => {
    return new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
    });
};
exports.logger = (0, winston_1.createLogger)({
    level: "info",
    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({ format: timezoned }), winston_1.format.printf(({ timestamp, level, message }) => `[${timestamp}][${level}] ${message}`)),
    transports: [
        new winston_1.transports.Console({}),
        new winston_1.transports.Stream({
            stream: (0, fs_1.createWriteStream)("logs/log_stream.txt"),
        }),
        new winston_1.transports.File({
            filename: "logs/application.log",
        }),
    ],
});
//# sourceMappingURL=logger.js.map
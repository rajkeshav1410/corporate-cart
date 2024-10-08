import { createLogger, transports, format } from "winston";
import { createWriteStream } from "fs";

const timezoned = () => {
  return new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
};

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: timezoned }),
    format.printf(
      ({ timestamp, level, message }) => `[${timestamp}][${level}] ${message}`
    )
  ),
  transports: [
    new transports.Console({}),
    new transports.Stream({
      stream: createWriteStream("logs/log_stream.txt"),
    }),
    new transports.File({
      filename: "logs/application.log",
    }),
  ],
});

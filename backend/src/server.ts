require("dotenv").config();

import cors, { CorsOptions } from "cors";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { logger } from "@app/common";
import { apiLogger, errorHandler } from "@app/middleware";
import {
  userRoute,
  authRoute,
  inventoryRouter,
  transactionRouter,
} from "@app/routes";

const app: Application = express();
const url = `${process.env.BASE_URL}:${process.env.PORT}`;

const corsOptions: CorsOptions = {
  origin: "*",
};

app.set("trust proxy", true);
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(apiLogger);

// app.use("/api/v1/admin", authenticate, isAdmin, adminRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/transaction", transactionRouter);

app.use(errorHandler);

// start the server
app.listen(
  parseInt(process.env.PORT || "8081", 10),
  process.env.BASE_URL || "localhost",
  () => {
    logger.info(`Server running: ${url}`);
  }
);

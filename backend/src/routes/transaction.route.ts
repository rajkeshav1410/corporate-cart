import { getTransaction } from "@app/controller";
import { authenticate, withErrorHandling } from "@app/middleware";

const express = require("express");
export const transactionRouter = express.Router();

transactionRouter
  .route("/")
  .post(authenticate, withErrorHandling(getTransaction));

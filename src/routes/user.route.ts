import { listUsers } from "@app/controller";
import { authenticate, isAdmin, withErrorHandling } from "@app/middleware";

const express = require("express");
export const userRoute = express.Router();

userRoute
  .route("/getAllUsers")
  .get(authenticate, isAdmin, withErrorHandling(listUsers));

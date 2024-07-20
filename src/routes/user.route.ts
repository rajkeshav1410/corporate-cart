import { authenticate, isAdmin } from "../middleware/auth.middleware";
import withErrorHandling from "../middleware/handleAsync";
import { listUsers } from "../controller/user.controller";

const express = require("express");
export const userRoute = express.Router();

userRoute
  .route("/getAllUsers")
  .get(authenticate, isAdmin, withErrorHandling(listUsers));

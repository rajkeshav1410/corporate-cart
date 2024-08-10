import { signup, login, me, logout } from "@app/controller";
import {
  withErrorHandling,
  authenticate,
  isAuthenticated,
} from "@app/middleware";

const express = require("express");
export const authRoute = express.Router();

authRoute.route("/signup").post(withErrorHandling(signup));
authRoute.route("/login").post(withErrorHandling(login));
authRoute.route("/track").get(isAuthenticated, withErrorHandling(me));
authRoute.route("/logout").post(authenticate, withErrorHandling(logout));

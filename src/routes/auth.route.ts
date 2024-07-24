import { signup, login, me, logout } from "@app/controller";
import { withErrorHandling, authenticate } from "@app/middleware";

const express = require("express");
export const authRoute = express.Router();

authRoute.route("/signup").post(withErrorHandling(signup));
authRoute.route("/login").post(withErrorHandling(login));
authRoute.route("/me").get(authenticate, withErrorHandling(me));
authRoute.route("/logout").post(authenticate, withErrorHandling(logout));

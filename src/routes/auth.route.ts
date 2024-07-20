import { authenticate } from "../middleware/auth.middleware";
import withErrorHandling from "../middleware/handleAsync";
import { login, signup, me, logout } from "../controller/auth.controller";

const express = require("express");
export const authRoute = express.Router();

authRoute.route("/signup").post(withErrorHandling(signup));
authRoute.route("/login").post(withErrorHandling(login));
authRoute.route("/me").get(authenticate, withErrorHandling(me));
authRoute.route("/logout").post(authenticate, withErrorHandling(logout));

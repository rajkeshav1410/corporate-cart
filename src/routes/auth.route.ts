import { authenticate } from "../middleware/auth.middleware";
import withErrorHandling from "../middleware/handleAsync";
import { login, signup, me, logout } from "../controller/auth.controller";

const express = require("express");
const router = express.Router();

router.route("/signup").post(withErrorHandling(signup));
router.route("/login").post(withErrorHandling(login));
router.route("/me").get(authenticate, withErrorHandling(me));
router.route("/logout").post(authenticate, withErrorHandling(logout));

module.exports = router;
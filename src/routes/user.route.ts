import { authenticate, isAdmin } from "../middleware/auth.middleware";
import withErrorHandling from "../middleware/handleAsync";
import { listUsers } from "../controller/user.controller";

const express = require("express");
const router = express.Router();

router
  .route("/getAllUsers")
  .get(authenticate, isAdmin, withErrorHandling(listUsers));

module.exports = router;

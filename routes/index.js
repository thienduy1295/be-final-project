const express = require("express");
const router = express.Router();

/** User endpoints */
const userRouter = require("./users.api");
router.use("/users", userRouter);

module.exports = router;

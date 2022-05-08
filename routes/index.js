const express = require("express");
const router = express.Router();

/** User endpoints */
const userRouter = require("./users.api");
router.use("/users", userRouter);

/** Task endpoints */
const taskRouter = require("./tasks.api");
router.use("/tasks", taskRouter);

module.exports = router;

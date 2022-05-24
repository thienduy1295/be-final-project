const express = require("express");
const router = express.Router();

/** User endpoints */
const userRouter = require("./users.api");
router.use("/users", userRouter);

/** Task endpoints */
const taskRouter = require("./tasks.api");
router.use("/tasks", taskRouter);

/** BimLib endpoints */
const bimLibRouter = require("./bimLib.api");
router.use("/bimLibrary", bimLibRouter);

/** Project endpoints */
const projectRouter = require("./project.api");
router.use("/project", projectRouter);

module.exports = router;

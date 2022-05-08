const express = require("express");
const { loginRequired, isAdmin } = require("../middleware/authentication");
const router = express.Router();

/**
 * @route POST / Bim
 * @description Create Bim
 * @access Login required, Role:Admin
 */
router.post("/createTask", loginRequired, isAdmin);

module.exports = router;

const express = require("express");
const {
  createBim,
  updateBim,
  deleteBim,
  getAllBim,
  getSingleBim,
} = require("../controllers/bim.controller");
const { loginRequired, isAdmin } = require("../middleware/authentication");
const router = express.Router();

/**
 * @route POST / Bim
 * @description Create Bim
 * @access Login required, Role:Admin
 */
router.post("/createBim", loginRequired, isAdmin, createBim);

/**
 * @route PUT / Bim
 * @description Update Bim
 * @access Login required, Role:Admin
 */
router.put("/:bimId", loginRequired, isAdmin, updateBim);

/**
 * @route DELETE / Bim
 * @description Delete Bim
 * @access Login required, Role:Admin
 */
router.delete("/:bimId", loginRequired, isAdmin, deleteBim);

/**
 * @route GET / Bim
 * @description get all Bim model
 * @access :all roles
 */
router.get("/all", loginRequired, getAllBim);

/**
 * @route GET / Bim
 * @description get single Bim model
 * @access :all roles
 */
router.get("/:bimId", loginRequired, getSingleBim);

module.exports = router;

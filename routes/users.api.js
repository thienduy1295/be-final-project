const express = require("express");
const {
  register,
  loginEmailPassword,
  getAllUsers,
  getSingleUserById,
  getCurrentUserProfile,
  updateCurrentUser,
  deleteUser,
} = require("../controllers/user.controllers");
const { loginRequired } = require("../middleware/authentication");
const router = express.Router();

/**
 * @route POST /users
 * @description Create an account by email and password, roles is staff
 * @access Login required
 */
router.post("/register", register);

/**
 * @route POST /users
 * @description Login by email and password
 * @access Login required
 */
router.post("/login", loginEmailPassword);

/**
 * @route GET /users
 * @description Get all user
 * @access Login required
 */
router.get("/all", getAllUsers);

/**
 * @route GET /users
 * @description Get single user by id
 * @access Login required
 */
router.get("/:userId", getSingleUserById);

/**
 * @route GET /users
 * @description Get own user's information
 * @access Login required
 */
router.get("/me/get", loginRequired, getCurrentUserProfile);

/**
 * @route PUT /users
 * @description Update own user's information
 * @access Login required
 */
router.put("/me/update", loginRequired, updateCurrentUser);

/**
 * @route DEL /users
 * @description Delete user by id
 * @access Login required
 */
router.delete("/delete/:userId", loginRequired, deleteUser);

module.exports = router;

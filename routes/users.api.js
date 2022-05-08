const express = require("express");
const { body, param, header } = require("express-validator");
const {
  register,
  loginEmailPassword,
  getAllUsers,
  getSingleUserById,
  getCurrentUserProfile,
  updateCurrentUser,
  deleteUser,
} = require("../controllers/user.controllers");
const { loginRequired, isAdmin } = require("../middleware/authentication");
const { validate, checkObjectId } = require("../middleware/validator");
const router = express.Router();

/**
 * @route POST /users
 * @description Create an account by email and password, roles is staff
 * @access Login required
 */
router.post(
  "/register",
  validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email").exists().isEmail(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  register
);

/**
 * @route POST /users
 * @description Login by email and password
 * @access Login required
 */
router.post(
  "/login",
  validate([
    body("email", "Invalid email").exists().isEmail(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  loginEmailPassword
);

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
router.get(
  "/:userId",
  validate([param("userId").exists().isString().custom(checkObjectId)]),
  getSingleUserById
);

/**
 * @route GET /users
 * @description Get own user's information
 * @access Login required
 */
router.get(
  "/me/get",
  validate([header("authorization").exists().isString()]),
  loginRequired,
  getCurrentUserProfile
);

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
router.delete("/delete/:userId", loginRequired, isAdmin, deleteUser);

module.exports = router;

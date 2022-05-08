const express = require("express");
const { body, param } = require("express-validator");
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  listOfTaskReceive,
  UpdateTaskToReviewByStaff,
  UpdateTaskReviewByAdmin,
} = require("../controllers/task.controllers");
const { loginRequired, isAdmin } = require("../middleware/authentication");
const { validate, checkObjectId } = require("../middleware/validator");
const router = express.Router();

/**
 * @route POST /tasks
 * @description Create task
 * @access Login required, Role:Admin
 */
router.post("/createTask", loginRequired, isAdmin, createTask);

/**
 * @route GET /tasks
 * @description Get all tasks
 * @access Login required, Role:Admin
 */
router.get("/all", loginRequired, isAdmin, getAllTasks);

/**
 * @route PUT /tasks
 * @description Update task
 * @access Login required, Role:Admin
 */
router.put(
  "/:taskId",
  validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("assignee", "Invalid assignee")
      .exists()
      .isString()
      .notEmpty()
      .custom(checkObjectId),
  ]),
  loginRequired,
  isAdmin,
  updateTask
);

/**
 * @route DELETE /tasks
 * @description delete task
 * @access Login required, Role:Admin
 */
router.delete(
  "/:taskId",
  validate([param("taskId").exists().isString().custom(checkObjectId)]),
  loginRequired,
  isAdmin,
  deleteTask
);

/**
 * @route GET /tasks
 * @description Get task receiver
 * @access Login required
 */
router.get("/incoming", loginRequired, listOfTaskReceive);

/**
 * @route PUT /tasks
 * @description Update task receiver
 * @access Login required
 */
router.put(
  "/incoming/:taskId",
  validate([
    param("taskId").exists().isString().custom(checkObjectId),
    body("status").exists().isString().notEmpty(),
  ]),
  loginRequired,
  UpdateTaskToReviewByStaff
);

/**
 * @route PUT /tasks
 * @description Update task have status is review to done
 * @access Login required
 */
router.put(
  "/outgoing/:taskId",
  validate([
    param("taskId").exists().isString().custom(checkObjectId),
    body("status").exists().isString().notEmpty(),
  ]),
  loginRequired,
  isAdmin,
  UpdateTaskReviewByAdmin
);

module.exports = router;

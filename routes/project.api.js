const express = require("express");
const {
  getAllProject,
  createProject,
} = require("../controllers/project.controller");
const { loginRequired, isAdmin } = require("../middleware/authentication");
const router = express.Router();

router.post("/create", loginRequired, createProject);

router.get("/all", getAllProject);

module.exports = router;

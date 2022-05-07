const bcrypt = require("bcryptjs");
const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const User = require("../models/User");

const userController = {};

// 1. Staff can create an account by email and password, roles default: staff
userController.register = catchAsync(async (req, res, next) => {
  let { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    throw new AppError(409, "User already exists", "Register error");
  }
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({ name, email, password });

  const accessToken = user.generateToken();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user success"
  );
});

// 2. Users can log in with email and password
userController.loginEmailPassword = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }, "+password");
  if (!user) {
    throw new AppError(400, "User not found", "Login error");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(400, "Invalid credentials", "Login error");
  }
  const accessToken = user.generateToken();

  return sendResponse(
    res,
    200,
    { user, accessToken },
    null,
    "Login successful"
  );
});

// 3. Users can see a list of users
userController.getAllUsers = catchAsync(async (req, res, next) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const count = await User.countDocuments({ roles: "staff" });
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let usersList = await User.find({ roles: "staff" })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
  return sendResponse(
    res,
    200,
    { usersList, totalPage },
    null,
    "Get all user successful"
  );
});

userController.getSingleUserById = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found", "Get current user error");
  }
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get Single user by id successful"
  );
});

userController.getCurrentUserProfile = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    throw new AppError(404, "User not found", "Get current user error");
  }
  return sendResponse(
    res,
    200,
    true,
    currentUser,
    null,
    "Get current user information successful"
  );
});

userController.updateCurrentUser = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  let user = await User.findById(currentUserId);
  if (!user) {
    throw new AppError(404, "User not found", "Get current user error");
  }
  const allows = ["name"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });
  await user.save();

  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Update own user's information successful"
  );
});

userController.deleteUser = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const { userId } = req.params;
  console.log("Check here", currentUserId.roles);
  const loggedInUser = await User.findById(currentUserId);
  if (loggedInUser.roles === "admin") {
    let user = await User.findOneAndDelete({
      _id: userId,
    });
    if (!user) {
      throw new AppError(404, "User not found", "Update User error ");
    }
    return sendResponse(res, 200, true, {}, null, "Delete User successful");
  } else {
    throw new AppError(
      400,
      "You do not have the permission",
      "Delete User error"
    );
  }
});

module.exports = userController;

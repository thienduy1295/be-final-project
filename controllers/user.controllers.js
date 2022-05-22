const bcrypt = require("bcryptjs");
const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const User = require("../models/User");

const userController = {};

// 1. Staff can create an account by email and password, roles default: staff
userController.register = catchAsync(async (req, res, next) => {
  let { name, email, password, avatarUrl } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    throw new AppError(409, "Email already exists", "Register error");
  }
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  const newAccount = {};
  newAccount.name = name;
  newAccount.email = email;
  newAccount.password = password;
  newAccount.avatarUrl = avatarUrl ? avatarUrl : "";

  user = await User.create(newAccount);

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
    throw new AppError(400, "Password is not valid", "Login error");
  }
  const accessToken = user.generateToken();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login successful"
  );
});

// 3. Users can see a list of users
userController.getAllUsers = catchAsync(async (req, res, next) => {
  let { page, limit, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterCondition = [{ roles: "staff" }];

  const allow = ["name", "email"];
  allow.forEach((field) => {
    if (filter[field] !== undefined) {
      filterCondition.push({
        [field]: { $regex: filter[field], $options: "i" },
      });
    }
  });
  const filterCriteria = filterCondition.length
    ? { $and: filterCondition }
    : {};

  const count = await User.countDocuments(filterCriteria);
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let usersList = await User.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
  return sendResponse(
    res,
    200,
    true,
    { usersList, totalPage, count },
    null,
    "Get all user successful"
  );
});

userController.getAllData = catchAsync(async (req, res, next) => {
  const userList = await User.find({ roles: "staff" });
  return sendResponse(
    res,
    200,
    true,
    { userList },
    null,
    "Get all user successful"
  );
});

// 4. User can see the information the user by id
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
    { user },
    null,
    "Get Single user by id successful"
  );
});

// 5. Owners can see their own user information
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

// 6. Owner can update their account profile
userController.updateCurrentUser = catchAsync(async (req, res, next) => {
  let { newPassword, confirmPassword } = req.body;

  const { currentUserId } = req;
  let user = await User.findOne({ _id: currentUserId }, "+password");

  if (!user) {
    throw new AppError(404, "User not found", "Get current user error");
  }

  const allows = ["name", "avatarUrl"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  if (newPassword && confirmPassword) {
    const isMatch = await bcrypt.compare(newPassword, user.password);
    if (isMatch) {
      throw new AppError(
        400,
        "New password must be different old password",
        "Update user error"
      );
    }
    if (newPassword !== confirmPassword) {
      throw new AppError(
        400,
        "New Password and Confirm Password are not match",
        "Update user error"
      );
    } else {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(newPassword, salt);
      user.password = password;
    }
  } else if (newPassword || confirmPassword) {
    throw new AppError(
      400,
      "Missing newPassword or confirmPassword info",
      "Update user error"
    );
  }
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

// 7. Admin can delete staff's account by id
userController.deleteUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  let user = await User.findOneAndDelete({
    _id: userId,
  });
  if (!user) {
    throw new AppError(404, "User not found", "Update User error ");
  }
  return sendResponse(res, 200, true, {}, null, "Delete User successful");
});

module.exports = userController;

const jwt = require("jsonwebtoken");
const { AppError } = require("../helpers/utils");
const { checkObjectId } = require("./validator");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authMiddleware = {};

authMiddleware.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      throw new AppError(401, "Token is Missing", "Login Require Error");
    }
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        throw new AppError(401, "Token Error", "Login Require Error");
      }
      checkObjectId(payload._id);
      req.currentUserId = payload._id; //undefiend
      req.currentRole = payload.roles;
    });
    next();
  } catch (error) {
    next(error);
  }
};

authMiddleware.isAdmin = (req, res, next) => {
  try {
    const { currentRole } = req;
    if (currentRole === "admin") {
      return next();
    }
    throw new AppError(
      401,
      "You do not have the permission",
      "Permission error"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;

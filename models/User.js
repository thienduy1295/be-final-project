const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true, select: false },
    avatarUrl: { type: String },
    roles: {
      type: String,
      require: true,
      enum: ["admin", "staff"],
      default: "staff",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  return obj;
};

userSchema.methods.generateToken = function () {
  const accessToken = jwt.sign(
    { _id: this._id, roles: this.roles },
    JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
  return accessToken;
};

const User = mongoose.model("Users", userSchema);
module.exports = User;

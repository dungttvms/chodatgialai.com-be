const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const { AppError } = require("../helpers/utils");
const User = require("../models/User");

const authentication = {};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          reject(new AppError(401, "Token Expired", "Authentication Error"));
        } else {
          reject(new AppError(401, "Token is invalid", "Authentication Error"));
        }
      } else {
        resolve(payload);
      }
    });
  });
};

authentication.loginRequired = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;

    if (!tokenString) {
      return next(new AppError(401, "Login Required", "Authentication Error"));
    }

    const token = tokenString.replace("Bearer ", "").replace("JWT ", "");
    const payload = await verifyToken(token);

    req.userId = payload._id;
    next();
  } catch (error) {
    next(error);
  }
};

authentication.adminRequired = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;

    if (!tokenString) {
      return next(new AppError(401, "Login Required", "Authentication Error"));
    }

    const token = tokenString.replace("Bearer ", "").replace("JWT ", "");
    const payload = await verifyToken(token);

    const user = await User.findById(payload._id);

    if (!user) {
      return next(new AppError(404, "User not found", "Authentication Error"));
    }

    if (user.role === "admin") {
      req.userId = payload._id;
      next();
    } else {
      return next(
        new AppError(403, "Permission Denied", "Authentication Error")
      );
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;

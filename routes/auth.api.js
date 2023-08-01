const express = require("express");
const validators = require("../middlewares/validators");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");

/**
 * @route POST /auth/login
 * @description Login with email and password
 * @body {email || PhoneNumber, password}
 * @access Public
 */
router.post(
  "/login",
  validators.validate([
    body("email")
      .if(body("phoneNumber").not().exists()) // Chỉ kiểm tra email nếu không có phoneNumber
      .isEmail()
      .withMessage("Invalid email")
      .normalizeEmail({ gmail_remove_dots: false }),
    body("phoneNumber")
      .if(body("email").not().exists()) // Chỉ kiểm tra phoneNumber nếu không có email
      .isNumeric()
      .withMessage("Invalid PhoneNumber"),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  authController.login
);
module.exports = router;

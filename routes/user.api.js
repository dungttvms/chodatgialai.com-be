const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const validators = require("../middlewares/validators.js");
const { body } = require("express-validator");

/**
 * @route POST /users
 * @description Create new User
 * @body {name, email, password, phoneNumber}
 * @access public
 */
router.post(
  "/",
  validators.validate([
    body("email", "Invalid Email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("name", "Invalid Name").exists().notEmpty(),
    body("phoneNumber", "Invalid Phone Number").exists().notEmpty(),
    body("password", "Invalid Password").exists().notEmpty(),
  ]),
  userController.register
);
module.exports = router;

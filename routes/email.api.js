const express = require("express");
const router = express.Router();
const emailController = require("../controllers/email.controller");
const validators = require("../middlewares/validators");
const { body } = require("express-validator");

/**
 * @route POST /emails
 * @description Save Email data
 * @body {email}
 * @access public
 */

router.post(
  "/",
  validators.validate([
    body("email", "Invalid Email")
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
  ]),
  emailController.sentEmail
);

module.exports = router;

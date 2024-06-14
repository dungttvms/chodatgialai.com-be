const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const validators = require("../middlewares/validators.js");
const { body, param } = require("express-validator");
const authentication = require("../middlewares/authentication.js");

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

/**
 * @route POST /users/me/:postId
 * @description Add Favorite Post to List
 * @body {postId}
 * @access Login Required
 */

router.post(
  "/me/:postId",
  authentication.loginRequired,
  validators.validate([
    param("postId").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.addPostToFavoriteList
);

/**
 * @route DELETE /users/me/:postId
 * @description remove a post from favorite List
 * @access Login required
 */

router.delete(
  "/me/:postId",
  authentication.loginRequired,
  userController.deletePostFromFavoriteList
);

/**
 * @route PUT /users/changePassword
 * @description Change Password
 * @body {oldPassword, newPassword}
 * @access Login required
 */

router.put(
  "/changePassword",
  authentication.loginRequired,
  validators.validate([
    body("oldPassword", "Invalid Old Password").notEmpty(),
    body("newPassword", "Invalid New Password").notEmpty(),
  ]),
  userController.changePassword
);

/**
 * @route GET /users/me
 * @description Get current user info
 * @access Login required
 */
router.get("/me", authentication.loginRequired, userController.getCurrentUser);

/**
 * @route PUT /users/me
 * @description Update Current User
 * @body {name, avatar, phoneNumber}
 * @access Login required
 */
router.put(
  "/me",
  authentication.loginRequired,
  userController.updateCurrentUser
);

/**
 * @route GET /users/admin
 * @description Load All User
 * @access Admin
 */
router.get(
  "/admin",
  authentication.adminRequired,
  userController.getAllUsersByAdmin
);

/**
 * @route GET /users/:userId
 * @description Get Single User by Admin
 * @access Admin
 */

router.get(
  "/admin/:userId",
  authentication.adminRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.getSingleUserByAdmin
);

/**
 * @route PUT /users/:userId
 * @description Update Single User By Admin
 * @body {name, Email, phoneNumber, role}
 * @access Admin
 */
router.put(
  "/admin/:targetUserId",
  authentication.adminRequired,
  validators.validate([
    param("targetUserId").isString().custom(validators.checkObjectId),
  ]),
  userController.updateSingleUserByAdmin
);

/**
 * @route DELETE /users/admin/:userId
 * @description Delete Single User
 * @access Admin
 */
router.delete(
  "/admin/:userId",
  authentication.adminRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.deleteSingleUserByAdmin
);

module.exports = router;

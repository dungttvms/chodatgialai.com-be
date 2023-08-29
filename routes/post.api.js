const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");

/**
 * @route POST /posts
 * @description Create a new post
 * @body {title, description, type, images, author, district, address, direction, price}
 * @access Login required
 */

router.post(
  "/",
  authentication.loginRequired,

  validators.validate([
    body("type", "Invalid type")
      .exists()
      .notEmpty()
      .isIn(["house", "residential_land", "farm_land", "office"]),
    body("district", "Invalid district")
      .exists()
      .notEmpty()
      .isIn([
        "pleiku",
        "chupah",
        "chupuh",
        "chuse",
        "iagrai",
        "ducco",
        "dakdoa",
        "chuprong",
        "mangyang",
        "krongpa",
        "ankhe",
        "phuthien",
        "ayunpa",
        "dakpo",
        "kbang",
        "kongchro",
        "iapa",
      ]),
    body("address", "Invalid address").exists().notEmpty(),
    body("title", "Invalid Title").exists().notEmpty(),
    body("description", "Invalid Description").exists().notEmpty(),
    body("wish", "Invalid wish").exists().notEmpty().isIn(["rent", "sell"]),
    body("direction")
      .optional()
      .isIn([
        "east",
        "west",
        "south",
        "north",
        "east-north",
        "east-south",
        "west-north",
        "west-south",
      ]),

    body("price", "Invalid price").exists().notEmpty().isString(),
    body("acreage", "Invalid acreage").exists().notEmpty().isString(),
  ]),
  postController.createNewPost
);

/**
 * @route GET /posts?page=1&limit=10
 * @description Load All Posts
 * @access Public
 */
router.get("/", postController.getPosts);

/**
 * @route GET /posts/:postId
 * @description Get Single Post
 * @access Login required
 */

router.get(
  "/:postId",
  authentication.loginRequired,
  validators.validate([
    param("postId").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.getSinglePost
);

/**
 * @route PUT /posts/:postId
 * @description Edit a Post
 * @body {title, description, type, images, author, district, address, direction, price}
 * @access Login required
 */

/**
 * @route DELETE /posts/:postId
 * @description Delete a Post
 * @access Login required
 */
module.exports = router;

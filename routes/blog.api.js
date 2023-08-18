const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { body } = require("express-validator");

/**
 * @route POST /blogs
 * @description Create a new blog
 * @body {title, imageCover, descriptionTitle, descriptionDetail}
 * @access Login Required
 */

router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("title", "Invalid Title").exists().notEmpty(),
    body("imageCover", "Invalid ImageCover").exists().notEmpty(),
    body("descriptionTitle", "Invalid DescriptionTitle").exists().notEmpty(),
    body("descriptionDetail", "Invalid DescriptionDetail").exists().notEmpty(),
  ]),
  blogController.createNewBlog
);

router.get("/", blogController.getAllBlogs);

/**
 * @route POST /blogs/:blogId
 * @description Get a blog
 * @access public
 */

router.get("/:blogId", blogController.getSingleBlog);

module.exports = router;

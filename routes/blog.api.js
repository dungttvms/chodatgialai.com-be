const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");

/**
 * @route POST /blogs
 * @description Create a new blog
 * @body {title, type, imageCover, descriptionTitle, descriptionDetail}
 * @access Login Required
 */

router.post(
  "/",
  authentication.adminRequired,
  validators.validate([
    body("title", "Invalid Title").exists().notEmpty(),
    body("type", "Invalid Type")
      .exists()
      .notEmpty()
      .isIn(["Tin tức", "Phong thủy", "Kinh nghiệm", "Nhà đẹp"]),
    body("imageCover", "Invalid ImageCover").exists().notEmpty(),
    body("descriptionTitle", "Invalid DescriptionTitle").exists().notEmpty(),
    body("descriptionDetail", "Invalid DescriptionDetail").exists().notEmpty(),
  ]),
  blogController.createNewBlog
);

/**
 * @route GET /blogs?page=1&limit=10
 * @description Get All Blogs
 * @access Public
 */
router.get("/", blogController.getAllBlogs);

/**
 * @route POST /blogs/:blogId
 * @description Get single blog
 * @access public
 */

router.get(
  "/:blogId",
  validators.validate([
    param("blogId").exists().isString().custom(validators.checkObjectId),
  ]),
  blogController.getSingleBlog
);

/**
 * @route PUT /blogs/:blogId
 * @description Update a Blog
 * @body {title, imageCover, descriptionTitle, descriptionDetail, type}
 * @access Admin required
 */
router.put(
  "/:blogId",
  authentication.adminRequired,
  validators.validate([
    param("blogId").exists().isString().custom(validators.checkObjectId),
  ]),
  blogController.updateSingleBlog
);

/**
 * @route DELETE /blogs/:blogId
 * @description Delete a Single Blog
 * @access Admin required
 */
router.delete(
  "/:blogId",
  authentication.adminRequired,
  validators.validate([
    param("blogId").exists().isString().custom(validators.checkObjectId),
  ]),
  blogController.deleteSingleBlog
);

/**
 * @route GET /blogs/blog/:type
 * @description Get Filter Blogs
 * @access Public
 */
router.get(
  "/blog/:type",
  validators.validate([param("type").isString().exists()]),
  blogController.getFilteredBlogs
);

module.exports = router;

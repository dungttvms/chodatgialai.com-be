const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controller");
const validators = require("../middlewares/validators");
const { body } = require("express-validator");

/**
 * @route POST /moviesearched
 * @description Save keyword search
 * @body {keyword}
 * @access public
 */

router.post(
  "/",
  validators.validate([body("keywordMovie", "Invalid Movies")]),
  movieController.movie
);

module.exports = router;

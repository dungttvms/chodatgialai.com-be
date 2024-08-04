const express = require("express");
const router = express.Router();
const phimGiaLaiController = require("../controllers/phimGiaLai.controller");

/**
 * @route POST /phimGiaLai
 * @description Chat Bot of Phim Gia Lai website
 * @body {username, Phone Number and movie}
 * @access Admin
 */

router.post("/", phimGiaLaiController.chatBot);

module.exports = router;

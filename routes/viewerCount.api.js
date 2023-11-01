// Trong file router.js
const express = require("express");
const router = express.Router();
const viewerCountController = require("../controllers/viewerCount.controller");

/**
 * @route GET /viewerCounts
 * @description Count Viewers
 * @access Admin
 */
router.get("/", viewerCountController.getViewerCount);

module.exports = router;

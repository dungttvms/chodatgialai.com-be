const express = require("express");
const router = express.Router();
const chatBotController = require("../controllers/chatBot.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { param } = require("express-validator");

/**
 * @route POST /chatBots
 * @description Collect data of User
 * @body {username, Phone Number and Province}
 * @access Admin
 */

router.post("/", chatBotController.collectData);

/**
 * @route GET /chatBots
 * @description get All User of ChatBot by Admin
 * @access Admin
 */

router.get("/", chatBotController.getChatBot);

/**
 * @route DEL /chatBots
 * @description Delete a User of Chat Bot List
 * @access Admin
 */

router.delete(
  "/:chatBotId",
  authentication.adminRequired,
  validators.validate([
    param("chatBotId").exists().isString().custom(validators.checkObjectId),
  ]),
  chatBotController.deleteChatBot
);

module.exports = router;

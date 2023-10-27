var express = require("express");
var router = express.Router();

//Auth API
const authApi = require("./auth.api");
router.use("/auth", authApi);

//User API
const userApi = require("./user.api");
router.use("/users", userApi);

//post API
const postApi = require("./post.api");
router.use("/posts", postApi);

//blog API
const blogApi = require("./blog.api");
router.use("/blogs", blogApi);

//OAuthAPI
const oauth = require("./oauth.api");
router.use("/oauth", oauth);

//email API
const emailApi = require("./email.api");
router.use("/emails", emailApi);

//chatBot API
const chatBotApi = require("./chatBot.api");
router.use("/chatBots", chatBotApi);

module.exports = router;

var express = require("express");
var router = express.Router();

//blog API
const blogApi = require("./blog.api");
router.use("/blogs", blogApi);

//chatBot API
const chatBotApi = require("./chatBot.api");
router.use("/chatBots", chatBotApi);

//email API
const emailApi = require("./email.api");
router.use("/emails", emailApi);

//movie requested API (Phim Gia Lai, user searches keyword find movies)
const movieApi = require("./movie.api");
router.use("/keywordMovie", movieApi);

//PhimGiaLai API (Chatbot data Phim Gia Lai)
const phimGiaLai = require("./phimGiaLai.api");
router.use("/phimgialai", phimGiaLai);

//post API
const postApi = require("./post.api");
router.use("/posts", postApi);

//User API
const userApi = require("./user.api");
router.use("/users", userApi);

//Auth API
const authApi = require("./auth.api");
router.use("/auth", authApi);

//OAuthAPI
const oauth = require("./oauth.api");
router.use("/oauth", oauth);

//viewerCount API
const viewerCountApi = require("./viewerCount.api");
router.use("/viewerCounts", viewerCountApi);

module.exports = router;

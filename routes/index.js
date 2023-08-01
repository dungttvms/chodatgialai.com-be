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

// //reaction API
// const reactionApi = require("./reaction.api");
// router.use("/reactions", postApi);

module.exports = router;

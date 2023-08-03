const { catchAsync, sendResponse } = require("../helpers/utils");
const Post = require("../models/Post");
const User = require("../models/User");

const postController = {};
const calculatePostCount = async (userId) => {
  const postCount = await Post.countDocuments({
    author: userId,
    isDeleted: false,
  });
  await User.findByIdAndUpdate(userId, { postCount });
};

postController.createNewPost = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;

  let {
    title,
    type,
    description,
    image,
    district,
    address,
    acreage,
    wish,
    direction,
    price,
  } = req.body;

  let post = await Post.create({
    title,
    type,
    description,
    image,
    district,
    address,
    acreage,
    wish,
    direction,
    price,

    author: currentUserId,
  });
  await calculatePostCount(currentUserId);
  post = await post.populate("author");
  return sendResponse(res, 200, true, post, null, "Created Post Success");
});

postController.getPosts = catchAsync(async (req, res, next) => {
  let { page, limit } = { ...req.query };

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterConditions = [{ isDeleted: false }];
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Post.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);
  let posts = await Post.find(filterCriteria)
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  return sendResponse(
    res,
    200,
    true,
    { posts, totalPages, count },
    null,
    "Get All Posts Successful"
  );
});

module.exports = postController;

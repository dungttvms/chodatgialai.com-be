const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
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
  console.log(currentUserId);
  const user = await User.findById(currentUserId);
  if (user.role !== "admin") {
    throw new AppError(403, "Access Denied", "Created Post Error");
  } else {
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
  }
});

postController.getPosts = catchAsync(async (req, res, next) => {
  let { page, limit } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 8;

  const filterConditions = [{ isDeleted: false }];
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Post.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let posts = await Post.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(
    res,
    200,
    true,
    { posts, totalPages, count },
    null,
    "Get All Posts Successful"
  );
});

postController.getSinglePost = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;

  const post = await Post.findById(postId);
  if (!post) throw new AppError(400, "Post not found", "Get Single Post Error");
  return sendResponse(res, 200, true, post, null, "Get Single Post Success");
});

module.exports = postController;

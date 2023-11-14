const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Post = require("../models/Post");
const User = require("../models/User");

const postController = {};
const calculatePostCount = async (userId) => {
  const postCount = await Post.countDocuments({
    isDeleted: false,
  });
  await User.findByIdAndUpdate(userId, { postCount });
};

postController.createNewPost = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;

  const {
    title,
    address,
    acreage,
    length,
    width,
    direction,
    legal,
    status,
    type,
    description,
    images,
    legal_images,
    province,
    price,
    toilet,
    bedroom,
    videoYoutube,
    videoFacebook,
    videoTiktok,
    googleMapLocation,
    contact_name,
    contact_phoneNumber,
  } = req.body;

  let post = await Post.create({
    title,
    address,
    acreage,
    length,
    width,
    direction,
    legal,
    status,
    type,
    description,
    province,
    images,
    legal_images,
    price,
    toilet,
    bedroom,
    videoYoutube,
    videoFacebook,
    videoTiktok,
    googleMapLocation,
    contact_name,
    contact_phoneNumber,

    author: currentUserId,
  });

  post = await post.populate("author");
  await calculatePostCount(currentUserId);

  return sendResponse(res, 200, true, post, null, "Created Post Success");
});

postController.getAllPosts = catchAsync(async (req, res, next) => {
  let { page, limit } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const filterConditions = [{ isDeleted: false }];

  // if (province) {
  //   filterConditions.push({
  //     province: province,
  //   });
  // }

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
  await Post.findByIdAndUpdate(postId, { $inc: { viewsCount: 1 } });

  const post = await Post.findById(postId);
  if (!post) throw new AppError(400, "Post not found", "Get Single Post Error");
  return sendResponse(res, 200, true, post, null, "Get Single Post Success");
});

postController.updateSinglePost = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;

  let post = await Post.findById(postId);
  if (!post) throw new AppError(400, "Post not found", "Updated Post error");

  const allows = [
    "title",
    "address",
    "acreage",
    "length",
    "width",
    "legal",
    "type",
    "description",
    "direction",
    "images",
    "legal_images",
    "province",
    "price",
    "googleMapLocation",
    "videoFacebook",
    "videoYoutube",
    "videoTiktok",
    "contact_name",
    "contact_phoneNumber",
    "isSoldOut",
  ];
  allows.forEach((field) => {
    if (
      req.body[field] !== undefined &&
      req.body[field] !== "" &&
      req.body[field].length > 0
    ) {
      post[field] = req.body[field];
    }
  });
  await post.save();
  return sendResponse(
    res,
    200,
    true,
    post,
    null,
    "Updated Single Post Successful"
  );
});

postController.deleteSinglePost = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  let post = await Post.findByIdAndUpdate(
    { _id: postId },
    { isDeleted: true },
    { new: true }
  );
  if (!post) throw new AppError(404, "Post not found", "Deleted Post Error");
  return sendResponse(
    res,
    200,
    true,
    post,
    null,
    "Deleted Single Post Success"
  );
});

postController.getPostsFilterByProvince = catchAsync(async (req, res, next) => {
  let { page, limit } = req.query;
  const filterProvince = req.params.province;
  const province = filterProvince;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const filterConditions = [{ isDeleted: false, province: province }];

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Post.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let filteredPosts = await Post.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(
    res,
    200,
    true,
    { filteredPosts, totalPages, count },
    null,
    "Get Filtered Province Posts Successful"
  );
});

postController.getFavoritePosts = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  // Lấy danh sách các ID của các bài đăng yêu thích từ trường favoriteList của người dùng
  const user = await User.findById(userId).select("favoritePostList");
  const favoritePostIds = user.favoritePostList;

  // Sử dụng các ID này để tìm các bài đăng
  const favoritePosts = await Post.find({ _id: { $in: favoritePostIds } });

  return sendResponse(
    res,
    200,
    true,
    favoritePosts,
    null,
    "Get Favorite Posts Successful"
  );
});

module.exports = postController;

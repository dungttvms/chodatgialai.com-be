const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  const { name, phoneNumber, email, password } = req.body;

  let user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  if (user) {
    throw new AppError(400, "User already exists", "Created User error");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  user = await User.create({
    name,
    email,
    password: hashedPassword,
    phoneNumber,
  });

  const verifyToken = jwt.sign(
    { userId: user._id },
    JWT_SECRET_KEY, // Sử dụng chuỗi bí mật làm khóa
    {
      expiresIn: "1d", // Token expires in 1 day
    }
  );
  user.verifyToken = verifyToken;
  await user.save();

  const accessToken = await user.generateToken();
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create User successful"
  );
});

userController.addPostToFavoriteList = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const postId = req.params.postId;

  const user = await User.findById(userId);
  if (!user)
    throw new AppError(400, "User not exists", "Add favorite post list error");

  const post = await Post.findById(postId);
  if (!post)
    throw new AppError(400, "Post not exists", "Add favorite post list error");

  if (!user.favoritePostList.includes(postId)) {
    user.favoritePostList.push(postId);
    await user.save();
    return sendResponse(
      res,
      200,
      true,
      user,
      null,
      "Add post to Favorite List success"
    );
  } else {
    return new AppError(
      200,
      "Post is exists in your Favorite List",
      "Add favorite post list error"
    );
  }
});

userController.deletePostFromFavoriteList = catchAsync(
  async (req, res, next) => {
    const userId = req.userId;
    const postId = req.params.postId;

    const user = await User.findById(userId);
    if (!user)
      throw new AppError(
        400,
        "User not exists",
        "Delete favorite post list error"
      );

    const post = await Post.findById(postId);
    if (!post)
      throw new AppError(
        400,
        "Post not exists",
        "Delete favorite post list error"
      );

    if (user.favoritePostList.includes(postId)) {
      user.favoritePostList.pull(postId); // Sử dụng pull để xóa phần tử
      await user.save();
      return sendResponse(
        res,
        200,
        true,
        user,
        null,
        "Delete post from Favorite List success"
      );
    } else {
      throw new AppError(
        200,
        "Post is not exists in your Favorite List",
        "Delete favorite post list error"
      );
    }
  }
);

// userController.verifyEmail = async (req, res, next) => {
//   const { token } = req.params;

//   try {
//     const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
//     const userId = decodedToken.userId;

//     // Tìm và cập nhật trạng thái xác thực của người dùng
//     const user = await User.findByIdAndUpdate(userId, { isVerified: true });

//     if (!user) {
//       throw new AppError(400, "Verify Error", "User not found");
//     }

//     return sendResponse(res, 200, true, null, null, "Verify Email successful");
//   } catch (error) {
//     return next(new AppError(400, "Verify Error", "Invalid Token"));
//   }
// };

userController.changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const userId = req.params._id;

  let user = await User.findOne({ userId }, "+password");

  if (!user)
    throw new AppError(400, "Invalid Credentials", "Change Password Error");
  if (user.isGoogleAuth === true) {
    throw new AppError(
      400,
      "Google-authenticated users cannot change password",
      "Change Password Error"
    );
  }

  const salt = await bcrypt.genSalt(10);

  const hashedNewPassword = await bcrypt.hash(newPassword, salt);
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new AppError(400, "Password is not match", "Change Password Error");
  } else {
    user.password = hashedNewPassword;
    await user.save();
    return sendResponse(res, 200, true, null, null, "Changed Password Success");
  }
});

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  //Step 1: Get data
  const currentUserId = req.userId;

  //Step 2: Business Logic Validator
  const user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(400, "User not found", "Get Current User Error");

  //Step 3: Process

  //Step 4: Response result
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get Current User Successful"
  );
});

userController.updateCurrentUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  let user = await User.findById(currentUserId);
  let allows = ["name", "phoneNumber", "avatar"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined && req.body[field] !== "") {
      user[field] = req.body[field];
    }
  });
  await user.save();
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Updated Current User Success"
  );
});

userController.getAllUsersByAdmin = catchAsync(async (req, res, next) => {
  let { page, limit, filterByField } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;
  const filterConditions = [{ isDeleted: false }];

  if (filterByField) {
    filterConditions.push({ [filterByField]: req.query[filterByField] });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await User.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let users = await User.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(
    res,
    200,
    true,
    { users, totalPages, count },
    null,
    "Get All Users By Admin Success"
  );
});

userController.getSingleUserByAdmin = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user)
    throw new AppError(400, "User not found", "Get Single User By Admin Error");
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get Single User By Admin Success"
  );
});

userController.updateSingleUserByAdmin = catchAsync(async (req, res, next) => {
  const targetUserId = req.body.id;

  let targetUser = await User.findById(targetUserId);
  if (!targetUser)
    throw new AppError(
      400,
      "User not found",
      "Update Single User By Admin Error"
    );
  const allows = ["name", "phoneNumber", "role"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      targetUser[field] = req.body[field];
    }
  });
  await targetUser.save();
  return sendResponse(
    res,
    200,
    true,
    targetUser,
    null,
    "Updated Single User By Admin Success"
  );
});

userController.deleteSingleUserByAdmin = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  let user = await User.findByIdAndUpdate(
    { _id: userId },
    { isDeleted: true },
    { new: true }
  );
  if (!user)
    throw new AppError(400, "User not found", "Deleted User By Admin Error");
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Delete User By Admin Success"
  );
});

module.exports = userController;

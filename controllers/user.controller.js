const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  const { name, phoneNumber, email, password } = req.body;
  console.log(password);
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

userController.verifyEmail = async (req, res, next) => {
  const { token } = req.params;

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    const userId = decodedToken.userId;

    // Tìm và cập nhật trạng thái xác thực của người dùng
    const user = await User.findByIdAndUpdate(userId, { isVerified: true });

    if (!user) {
      throw new AppError(400, "Verify Error", "User not found");
    }

    return sendResponse(res, 200, true, null, null, "Verify Email successful");
  } catch (error) {
    return next(new AppError(400, "Verify Error", "Invalid Token"));
  }
};

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
module.exports = userController;

const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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

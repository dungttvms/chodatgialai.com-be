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

module.exports = userController;

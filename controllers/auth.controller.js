const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const authController = {};

authController.login = catchAsync(async (req, res, next) => {
  try {
    // Step 1: Get data from request
    const { email, password } = req.body; // Fix missing comma

    const user = await User.findOne({ email }, "+password");

    if (!user) throw new AppError(400, "Invalid Credentials", "Login Error");

    // Step 3: Process
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new AppError(400, "Wrong password", "Login Error");

    const accessToken = await user.generateToken();

    // Step 4: Response result
    return sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      null,
      "Login successful"
    );
  } catch (error) {
    // Handle errors here
    return next(error); // Use next to pass the error to the error handling middleware
  }
});

authController.loginWithGoogle = catchAsync(async (req, res, next) => {
  try {
    const { email, name, picture } = req.body;

    if (!email)
      throw new AppError(400, "Email is required", "Login google Error");

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name,
        email: email,
        avatar: picture,
        isGoogleAuth: true,
      });
    }

    const accessToken = await user.generateToken();

    return sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      null,
      "Login with Google successful"
    );
  } catch (error) {
    // Handle errors here
    return next(error); // Use next to pass the error to the error handling middleware
  }
});

module.exports = authController;

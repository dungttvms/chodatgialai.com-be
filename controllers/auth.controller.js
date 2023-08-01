const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const authController = {};
authController.login = catchAsync(async (req, res, next) => {
  //Step1: Get data from request
  if (req.body.email || req.body.phoneNumber) {
    let { email, phoneNumber, password } = req.body;

    const user = await User.findOne(
      { $or: [{ email }, { phoneNumber }] },
      "+password"
    );

    if (!user) throw new AppError(400, "Invalid Credentials", "Login Error");

    //Step 3: Process
    //3.1 So sánh mật khẩu nhập vào và mật khẩu đã được mã hóa bằng bcrypt (compare)
    const isMatch = await bcrypt.compare(password, user.password);

    // const isMatch = password === user.password;
    if (!isMatch) throw new AppError(400, "Wrong password", "Login Error");

    //3.2. Xử lý dữ liệu
    const accessToken = await user.generateToken();

    //Step 4: Response result
    return sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      // { user },
      null,
      "Login successful"
    );
  }
  return new AppError(400, "Login error", "Login Error");
});

module.exports = authController;

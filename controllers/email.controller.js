const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Email = require("../models/Email");

const emailController = {};

emailController.sentEmail = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  if (!email) throw new AppError(400, "Error", "Sent Email Error");
  const existingEmail = await Email.findOne({ email });
  if (existingEmail) {
    return sendResponse(res, 400, false, null, "Email already exists", "Error");
  }
  let data = await Email.create({ email });
  return sendResponse(res, 200, true, data, null, "Success");
});

module.exports = emailController;

const { catchAsync, sendResponse } = require("../helpers/utils");
const phimGiaLai = require("../models/PhimGiaLai");

const phimGiaLaiController = {};

phimGiaLaiController.chatBot = catchAsync(async (req, res, next) => {
  const requestData = req.body;

  let data = await phimGiaLai.create(requestData);
  return sendResponse(res, 200, true, data, null, "Success");
});

module.exports = phimGiaLaiController;

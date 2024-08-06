const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const MovieRequested = require("../models/Movie");

const movieController = {};

movieController.movieRequested = catchAsync(async (req, res, next) => {
  const keyword = req.body.keyword;

  let data = await MovieRequested.create({ keyword });
  return sendResponse(res, 200, true, data, null, "Success");
});

module.exports = movieController;

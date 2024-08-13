const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Movie = require("../models/Movie");

const movieController = {};

movieController.movie = catchAsync(async (req, res, next) => {
  const keyword = req.body.keyword;

  let data = await Movie.create({ keyword });
  return sendResponse(res, 200, true, data, null, "Success");
});

module.exports = movieController;

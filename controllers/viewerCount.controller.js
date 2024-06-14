const { catchAsync, sendResponse } = require("../helpers/utils");
const ViewerCount = require("../models/ViewerCount");

const viewerCountController = {};

viewerCountController.getViewerCount = catchAsync(async (req, res, next) => {
  //   const ipAddress = req.ip;
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const existingViewer = await ViewerCount.findOneAndUpdate({ ipAddress }); //note lại findOne

  if (existingViewer) {
    existingViewer.views++;
    await existingViewer.save();
  } else {
    const newViewer = new ViewerCount({ ipAddress, views: 1 });
    await newViewer.save();
  }

  const totalViewers = await ViewerCount.aggregate([
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ])
    .then((result) => (result[0] ? result[0].totalViews : 0))
    .catch((err) => 0);

  return sendResponse(res, 200, true, totalViewers, null, "Success");
});

module.exports = viewerCountController;

const { catchAsync, sendResponse } = require("../helpers/utils");
const dataChatBot = require("../models/DataChatBot"); // Chú ý: thay "DataChatBot" thành "dataChatBot"

const chatBotController = {};

chatBotController.collectData = catchAsync(async (req, res, next) => {
  const requestData = req.body;

  let data = await dataChatBot.create(requestData);
  return sendResponse(res, 200, true, data, null, "Success");
});

chatBotController.getChatBot = catchAsync(async (req, res, next) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const filterConditions = [{ isDeleted: false }];

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await dataChatBot.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let chatBot = await dataChatBot
    .find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(
    res,
    200,
    true,
    { chatBot, totalPages, count },
    null,
    "Get Chat Bot Successful"
  );
});

chatBotController.deleteChatBot = catchAsync(async (req, res, next) => {
  const chatBotId = req.params.chatBotId;
  console.log(req.params);
  let chatBot = await dataChatBot.findByIdAndUpdate(
    { _id: chatBotId },
    { isDeleted: true },
    { new: true }
  );
  if (!chatBot)
    throw new AppError(404, "User not found", "Deleted chatBot Error");
  return sendResponse(
    res,
    200,
    true,
    chatBot,
    null,
    "Deleted User Of ChatBot Success"
  );
});

module.exports = chatBotController;

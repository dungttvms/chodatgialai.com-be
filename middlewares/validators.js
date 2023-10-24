const { sendResponse } = require("../helpers/utils");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const validators = {};
validators.validate = (validationArray) => async (req, res, next) => {
  await Promise.all(validationArray.map((validation) => validation.run(req)));
  const errors = validationResult(req);

  // console.log("Errors", errors);
  if (errors.isEmpty()) return next();

  const message = errors
    .array()
    .map((error) => error.msg)
    .join(" & ");
  return sendResponse(res, 500, false, null, { message }, "Validation Error");
};

//Check ID match ID of MongooDB form
validators.checkObjectId = (paramId) => {
  if (!mongoose.Types.ObjectId.isValid(paramId)) {
    throw new Error("Invalid ObjectId");
  }
  return true;
};

module.exports = validators;

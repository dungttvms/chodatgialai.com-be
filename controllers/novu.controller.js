// const Novu = require("@novu/node");
// const { catchAsync, sendResponse } = require("../helpers/utils");

// const novuController = Novu(process.env.NOVU_API_KEY);
// novuControler.createSub = catchAsync(async (req, res, next) => {
//   const user = req.user;
//   console.log("USER:", user);

//   const data = await novuControler.subscribers.identify(user.id, {
//     email: user.email,
//     firstName: user.name,
//     phone: user.phoneNumber,
//     avatar: user.avatar,
//   });

//   return sendResponse(
//     res,
//     200,
//     true,
//     data,
//     null,
//     "Created Subcriber of Novu Success"
//   );
// });

// module.exports = novuControler;

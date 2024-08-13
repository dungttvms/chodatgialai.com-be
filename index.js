const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { sendResponse } = require("./helpers/utils");
const indexRouter = require("./routes/index");
const bodyParser = require("body-parser");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;

// Kết nối đến cơ sở dữ liệu chính
mongoose
  .connect(mongoURI)
  .then(() => console.log("Server is ready"))
  .catch((err) => console.log(err));

// Tạo kết nối đến cơ sở dữ liệu thứ hai
const mongoURI_PhimGiaLai = process.env.MONGODB_URI_PHIM_GIA_LAI;
const connectionPhimGiaLai = mongoose.createConnection(mongoURI_PhimGiaLai);

// Lắng nghe sự kiện 'connected' khi kết nối thành công
connectionPhimGiaLai.on("connected", () => {
  console.log("Server Phim Gia Lai is ready");
});

// Lắng nghe sự kiện 'error' nếu có lỗi khi kết nối
connectionPhimGiaLai.on("error", (err) => {
  console.error("Error connecting to Phim Gia Lai database:", err);
});

//Error Handler
//Catch 404 Error
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.statusCode = 404;
  next(err);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use((err, req, res, next) => {
  console.log("ERROR", err);
  if (err.isOperational) {
    return sendResponse(
      res,
      err.statusCode ? err.statusCode : 500,
      false,
      null,
      { message: err.message },
      err.errorType
    );
  } else {
    return sendResponse(
      res,
      err.statusCode ? err.statusCode : 500,
      false,
      null,
      { message: err.message },
      "Internal Server Error"
    );
  }
});

module.exports = app;

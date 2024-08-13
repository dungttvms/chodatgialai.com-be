const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userGiaLaiSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "client"], default: "client" },
    avatar: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false, select: false },
    isGoogleAuth: { type: Boolean, default: false, select: true },
    isFacebookAuth: { type: Boolean, default: false, select: true },
    movieFavoriteList: [],
  },
  { timestamps: true }
);

//Tao accessToken co hieu luc 1 tuần
userGiaLaiSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1w",
  });
  return accessToken;
};

const UserGiaLai = mongoose.model("UserGiaLai", userGiaLaiSchema);
module.exports = UserGiaLai;
// module.exports = (connection) =>
//   connection.model("UserGiaLai", userGiaLaiSchema);

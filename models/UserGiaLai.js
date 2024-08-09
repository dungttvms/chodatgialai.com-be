const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// const episodeSchema = new Schema(
//   {
//     server_name: { type: String, required: false },
//     server_data: [
//       {
//         name: { type: String },
//         slug: { type: String },
//         filename: { type: String },
//         link_embed: { type: String },
//         link_m3u8: { type: String },
//       },
//     ],
//   },
//   { _id: false }
// );

//================================
// const countrySchema = new Schema(
//   {
//     id: { type: String },
//     name: { type: String },
//     slug: { type: String },
//   },
//   { _id: false }
// );
// const categorySchema = new Schema(
//   {
//     id: { type: String },
//     name: { type: String },
//     slug: { type: String },
//   },
//   { _id: false }
// );
// const modifiedSchema = new Schema(
//   {
//     time: { type: String },
//   },
//   { _id: false }
// );
// const actorSchema = new Schema({}, { _id: false });
// const createdSchema = new Schema(
//   {
//     time: { type: String },
//   },
//   { _id: false }
// );

// const movieSchema = new Schema(
//   {
//     _id: { type: String },
//     year: { type: String },
//     view: { type: String },
//     type: { type: String },
//     trailer_url: { type: String },
//     time: { type: String },
//     thumb_url: { type: String },
//     sub_docquyen: { type: String },
//     status: { type: String },
//     slug: { type: String },
//     showtimes: { type: String },
//     quality: { type: String },
//     poster_url: { type: String },
//     origin_name: { type: String },
//     notify: { type: String },
//     name: { type: String },
//     modified: [modifiedSchema],
//     lang: { type: String },
//     is_copyright: { type: String },
//     episode_total: { type: String },
//     episode_current: { type: String },
//     director: [],
//     created: [createdSchema],
//     country: [countrySchema],
//     content: { type: String },
//     chieurap: { type: String },
//     category: [categorySchema],
//     actor: [actorSchema],
//   },
//   { _id: false }
// );

// const movieFavoriteSchema = new Schema({
//   episodes: [episodeSchema],
//   movie: [movieSchema],
//   msg: { type: String },
// });

const userGiaLaiSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "client"], default: "client" },
    avatar: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false, select: false },
    isGoogleAuth: { type: Boolean, default: false, select: true },
    movieFavoriteList: [],
  },
  { timestamps: true }
);

//Tao accessToken co hieu luc 1ngay
userGiaLaiSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const UserGiaLai = mongoose.model("UserGiaLai", userGiaLaiSchema);
module.exports = UserGiaLai;

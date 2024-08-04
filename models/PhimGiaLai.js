const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const phimGiaLaiSchema = Schema(
  {
    username: { type: String },
    phoneNumber: { type: String },
    movie: { type: String },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

const phimGiaLai = mongoose.model("phimGiaLai", phimGiaLaiSchema);
module.exports = phimGiaLai;

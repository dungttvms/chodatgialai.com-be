const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = Schema(
  {
    keyword: { type: String },
  },
  { timeStamps: true }
);
const MovieRequested = mongoose.model("Movie", movieSchema);
module.exports = MovieRequested;

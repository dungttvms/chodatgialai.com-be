const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = Schema(
  {
    author: { type: Schema.ObjectId, required: true, ref: "User" },
    target: { type: Schema.ObjectId, required: true, ref: "Post" },
    emoji: { type: String, required: true },
  },
  { timestamps: true }
);

const Reaction = mongoose.model("Reaction", reactionSchema);
module.exports = Reaction;

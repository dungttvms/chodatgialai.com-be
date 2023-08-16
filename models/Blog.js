const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = Schema(
  {
    title: { type: String, required: true },
    imageCover: { type: String, required: true },
    descriptionTitle: { type: String, required: true },
    descriptionDetail: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    process: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;

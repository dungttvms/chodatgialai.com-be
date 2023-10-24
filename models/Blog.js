const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["Tin tức", "Phong thủy", "Kinh nghiệm", "Nhà đẹp"],
    },
    imageCover: { type: String, required: true },
    descriptionTitle: { type: String, required: true },
    descriptionDetail: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    readCount: { type: Number, required: false, default: 0 },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;

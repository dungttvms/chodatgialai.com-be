const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = Schema(
  {
    title: { type: String, required: true },
    address: { type: String, required: false },
    acreage: { type: String, required: true },
    length: { type: String, required: true },
    width: { type: String, required: true },
    direction: { type: String },

    legal: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Đang bán", "Đã bán"],
      default: "Đang bán",
    },

    author: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
    },
    description: { type: String, required: true, default: "" },

    images: [],
    legal_images: [],

    province: {
      type: String,
      required: true,
      enum: ["Kon Tum", "Gia Lai", "Đăk Lăk", "Đăk Nông", "Lâm Đồng"],
    },

    vip: { type: Boolean, default: false },

    price: { type: String, required: true },
    bedroom: { type: String },
    toilet: { type: String },
    isSoldOut: { type: Boolean, default: false, select: false },
    isDeleted: { type: Boolean, default: false, select: false },

    reactions: { heart: { type: Number, required: false, default: 0 } },

    videoYoutube: { type: String },
    videoFacebook: { type: String },
    videoTiktok: { type: String },
    googleMapLocation: { type: String, required: true },

    contact_name: { type: String, required: true },
    contact_phoneNumber: { type: String, required: true },

    viewsCount: { type: Number, required: false, default: 0 },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;

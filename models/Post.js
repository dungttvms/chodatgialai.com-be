const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["house", "residential_land", "farm_land", "office"],
    },
    description: { type: String, required: true, default: "" },
    image: [{ type: String }],

    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    district: {
      type: String,
      required: true,
      enum: [
        "pleiku",
        "chupah",
        "chupuh",
        "chuse",
        "iagrai",
        "ducco",
        "dakdoa",
        "chuprong",
        "mangyang",
        "krongpa",
        "ankhe",
        "phuthien",
        "ayunpa",
        "dakpo",
        "kbang",
        "kongchro",
        "iapa",
      ],
    },
    address: { type: String, required: true },
    wish: { type: String, required: true, enum: ["rent", "sell"] },
    vip: { type: Boolean, default: false },
    direction: {
      type: String,
      default: "",
      enum: [
        "east",
        "west",
        "south",
        "north",
        "east-north",
        "east-south",
        "west-north",
        "west-south",
      ],
    },
    process: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    price: { type: String, required: true },
    acreage: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, select: false },
    reactions: { heart: { type: Number, default: 0 } },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;

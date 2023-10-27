const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataChatBotSchema = Schema(
  {
    username: { type: String },
    phoneNumber: { type: String },
    province: { type: String },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

const dataChatBot = mongoose.model("dataChatBot", dataChatBotSchema);
module.exports = dataChatBot;

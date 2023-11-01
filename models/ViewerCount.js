const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const viewSchema = Schema(
  {
    ipAddress: { type: String },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ViewerCount = mongoose.model("ViewerCount", viewSchema);

module.exports = ViewerCount;

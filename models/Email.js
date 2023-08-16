const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailSchema = Schema(
  {
    email: { type: String },
  },
  { timeStamps: true }
);
const Email = mongoose.model("Email", emailSchema);
module.exports = Email;

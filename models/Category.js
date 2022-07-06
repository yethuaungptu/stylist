const mongoose = require("mongoose"); //mongodb module

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: String,
    default: "0",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Admins",
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "Admins",
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  updated: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Categories", CategorySchema);

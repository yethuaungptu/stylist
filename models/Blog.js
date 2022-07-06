var mongoose = require("mongoose"); //mongodb module

var Schema = mongoose.Schema;
var BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  estPrice: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  shopId: {
    type: Schema.Types.ObjectId,
    ref: "Shops",
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Categories",
  },
  moreImg: {
    type: Array,
  },
  mainImg: {
    type: String,
    default: "null",
  },
  ageArrange: {
    type: String,
    required: true,
  },
  bmi: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: String,
    default: "0", // 0 is normal, 1 is deleted
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

module.exports = mongoose.model("Blogs", BlogSchema);

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
  shopId: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
  },
  image: [
    {
      url: {
        type: String,
      },
    },
  ],
  bgUrl: {
    type: String,
    default: "null",
  },
  phone: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: String,
    default: "0", // 0 is normal, 1 is deleted
  },
});

module.exports = mongoose.model("Blogs", BlogSchema);

var mongoose = require("mongoose"); //mongodb module

var Schema = mongoose.Schema;
var ShopSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pfUrl: {
    type: String,
    default: "null",
  },
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

module.exports = mongoose.model("Shops", ShopSchema);

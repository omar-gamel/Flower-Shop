const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  shopImage: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: []
  },
  totalFlowerCount:{
    type: Number,
    default:0
  }
});

shopSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Shop", shopSchema);

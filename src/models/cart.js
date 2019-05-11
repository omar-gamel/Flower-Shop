const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  flowers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flower',
    required: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalPrice: {
    type: Number,
    default: 0,
    required: true
  }
});

module.exports = mongoose.model("Cart", cartSchema);
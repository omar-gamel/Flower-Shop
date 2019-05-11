const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flowers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flower',
    required: true
  }],
  creationDate: {
    type: Date,
    default: Date.now
  },
  totalPrice: {
    type: Number,
    default: 0,
    required: true
  }
});

module.exports = mongoose.model('Order', orderSchema);
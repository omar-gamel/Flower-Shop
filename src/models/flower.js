const mongoose = require("mongoose");

const flowerSchema = new mongoose.Schema({
    flowerName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    description: {
        type: String,
        required: true,
        minlength: 15,
        maxlength: 255
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: true
    },
    flowerImage: {
        type: String,
        required: true,
    },
    sponsored: {
        type: Boolean,
        default: false
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    }
});

module.exports = mongoose.model("Flower", flowerSchema);
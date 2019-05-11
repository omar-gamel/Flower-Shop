const mongoose = require('mongoose');
const Cart = require('../models/cart');
const User = require('../models/user');
const Flower = require('../models/flower');

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

exports.add_to_cart = async (req, res, next) => {
    const userId = req.user._id;
    const flowerId = req.params.flowerId; // Should be from body ...
    try {
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        if(!isValidId(flowerId))
           return res.status(404).send('Invalid Flower ID');

        const flower = await Flower.findById(flowerId);
        if (!flower) {
            const error = new Error('Flower not found.');
            error.statusCode = 404;
            throw error;
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await new Cart({
                flowers: [flowerId],
                totalPrice: flower.price,
                user: userId
            }).save();
        } else {
            cart.flowers.push(flowerId);
            cart.totalPrice += flower.price;
            await cart.save();
        }
        return res.status(200).send(cart);
    } catch (error) {
        next(error);
    }
};

exports.get_cart = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
    
        const cart = await Cart.findOne({ user: userId }).populate('flowers');
        if (!cart) {
            const error = new Error('Cart not found.');
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({ cart: cart });
    } catch (error) {
      next(error);
    }
};
  
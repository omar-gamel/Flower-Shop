const Order = require('../models/order');
const User = require('../models/user');
const Cart = require('../models/cart');

exports.checkout = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
  
        const userCart = await Cart.findOne({ user: userId });
        if (!userCart)  {
            const error = new Error('This user not have shopping cart or cart is empty.');
            error.statusCode = 404;
            throw error;
        } 
  
        if (userCart.flowers.length < 1 && userCart.totalPrice === 0) {
            const error = new Error('Invalid process.');
            error.statusCode = 400;
            throw error;
        }

        const order = await new Order({
            user: userCart.user,
            flowers: userCart.flowers,
            totalPrice: userCart.totalPrice
        }).save();
    
        userCart.flowers = [];
        userCart.totalPrice = 0;

        await userCart.save();
  
        return res.status(200).send(order);
    } catch (error) {
      next(error);
    }
};

exports.get_All_User_Orders = async (req, res, next) => {
    const userId = req.user._id;
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try {
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        const orders = await Order.find({ user: userId })
           .populate('flowers')
           .skip((currentPage - 1) * perPage)
           .limit(+perPage)
           .sort({  creationDate: -1 });
        const count = await Order.count({ user: userId });
        const pageCount = Math.ceil(count / perPage);
        return res.status(200).json({
            orders,
            totalCount: count,
            pageCount,
            currentPage,
            perPage
        });
    } catch (error) {
        next(error);
    }
};
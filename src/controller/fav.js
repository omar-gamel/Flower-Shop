const mongoose = require('mongoose');
const Fav = require('../models/fav');
const User = require('../models/user');
const Flower = require('../models/flower');

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

exports.addToFav = async (req, res, next) => {
    const flowerId = req.params.flowerId;
    try {
        if (!isValidId(flowerId))
            return res.status(404).send('Not A Valid flower Id ');

        const flower = await Flower.findById(flowerId);
        if(!flower){
            const error = new Error('flower NOT Found , please register a new flower.');
            error.statusCode = 404;
            throw error;
        }
        const foundFav = await Fav.findOne({ user: req.user._id, flower: flowerId });
        if(foundFav) 
            return res.status(200).json({ message: 'Already Favourited', fav: foundFav });

        const fav = await new Fav({ 
            user: req.user._id, 
            flower: flowerId 
        }).save();

        return res.status(200).json({ message: 'Add To Favourite' , fav });
    } catch (error) {
        next(error);
    }
};

exports.getAllFavFllowers = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if(!user){
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }    
        
        const fav = await Fav.find({ user: userId }).populate('flower');
        if(!fav){
            const error = new Error('Flower not found.');
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).json({ fav: fav });
    } catch (error) {
      next(error);
    }
};

exports.removeFav = async (req, res, next) => {
    const flowerId = req.params.flowerId;
    try {
        const flower = await Flower.findById(flowerId);
        if(!flower){
            const error = new Error('flower NOT Found , please register a new flower.');
            error.statusCode = 404;
            throw error;
        }
        let fav = await Fav.findOneAndRemove({
            user: req.user._id,
            flower: flowerId
        });
  
        if (!fav) {
            const error = new Error('This flower isnot one of your favourite.');
            error.statusCode = 404;
            throw error;
        }
  
        return res.status(204).send();
    } catch (error) {
      next(error);
    }
};
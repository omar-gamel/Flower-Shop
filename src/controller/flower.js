const mongoose = require("mongoose");
const Flower = require('../models/flower');
const Shop = require('../models/shop');
const Fav = require('../models/fav');
const { validateFlower } = require('../services/validation');

const isValidId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

exports.get_All_Flowers = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 3;
    let sponsored = true;
    let isFav;
    try {
        const flowers = await Flower.find({ sponsored: sponsored })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);

        let fs = [];
        for (let i = 0; i < flowers.length; i++) {
            const fav = await Fav.findOne({
                user: req.user._id,
                flower: flowers[i]._id
            });
            
            (fav == null) ? isFav = false: isFav = true;

            fs.push(Object.assign({ isFav: isFav }, flowers[i].toJSON()));
        }

        const count = await Flower.count({ sponsored: sponsored });
        const pageCount = Math.ceil(count / perPage);
        return res.status(200).json({
            flowers: fs,
            totalCount: count,
            pageCount,
            currentPage,
            perPage
        });
    } catch (error) {
        next(error);
    }
};           

exports.get_All_Shop_Flowers = async (req, res, next) => {
    const shopId = req.params.shopId;
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try {
        if(!isValidId(shopId))
           return res.status(404).send('Not A valid Shop Id');

        const shop = await Shop.findById(shopId);
        if(!shop){
           const error = new Error('Shop Not Exit.');
           error.statusCode = 404;
           throw error;
        }
        const flowers = await Flower.find({ shop: shopId }).skip((currentPage - 1) * perPage).limit(perPage);
        const count = await Shop.countDocuments();
        const pageCount =  Math.ceil(count / perPage);
        return res.status(200).json({
           flowers,
           totalCount: count,
           pageCount,
           currentPage,
           perPage
        });
    } catch (error) {
        next(error);
    }
};

exports.create_new_flower = async (req, res, next) => {
    const { error } = validateFlower(req.body); 
    const shopId = req.params.shopId;
    try {
        if(!isValidId(shopId))
           return res.status(404).send('Not A valid Shop Id');
        
        if (error) 
           return res.status(400).send(error.details[0].message);

        if (!req.file) {
           const error = new Error('No image provided.');
           error.statusCode = 422;
           throw error;
        }
        const shop = await Shop.findById(shopId);
        if(!shop){
           const error = new Error('Shop Not Exit.');
           error.statusCode = 404;
           throw error;
        }
        const flower = await new Flower({
           flowerName: req.body.flowerName,
           price: req.body.price,
           description: req.body.description,
           flowerImage: req.file.path,
           sponsored: req.body.sponsored,
           shop: shopId
        }).save();   

        shop.totalFlowerCount += 1;
        await shop.save();

        return res.status(201).json({
           message: "Created flower successfully",
           createdflower: flower
        });
    } catch (error) {
        next(error);
    } 
};

exports.Flower_get_ById = async (req, res, next) => {
    const shopId = req.params.shopId;
    const flowerId = req.params.flowerId;
    try {
        if (!isValidId(shopId))
            return res.status(404).send('Not A Valid Shop Id ');

        if (!isValidId(flowerId))
            return res.status(404).send('Not A Valid flower Id ');  
    
        const shop = await Shop.findById(shopId);
        if(!shop){
            const error = new Error('Shop Not Exit.');
            error.statusCode = 404;
            throw error;
        }
        const flower = await Flower.findById( flowerId );
        if(!flower){
            const error = new Error('Flower Not Exit.');
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({ flower: flower });
    } catch (error) {
      next(error);
    }
};

exports.flower_patch = async (req, res, next) => {
    const shopId = req.params.shopId;
    const flowerId = req.params.flowerId;
    const { error } = validateFlower(req.body); 
    try {
        if (error) 
           return res.status(400).send(error.details[0].message);
        
        if (!isValidId(shopId))
            return res.status(404).send('Not A Valid Shop Id ');

        if (!isValidId(flowerId))
            return res.status(404).send('Not A Valid flower Id ');

        const shop = await Shop.findById(shopId);
        if(!shop){
            const error = new Error('Shop Not Exit.');
            error.statusCode = 404;
            throw error;
        }

        if (req.file) 
            req.body.flowerImage = req.file.path;
        
        const flower = await Flower.findOneAndUpdate(
            { _id: flowerId, shop: shop._id },
            req.body,
            { new: true }
        );
        if(!flower){
            const error = new Error('flower NOT Found , please register a new flower.');
            error.statusCode = 404;
            throw error;
        }
    
        return res.status(200).json({ message: 'flower updated', flower });

    } catch (error) {
      next(error);
    }
};

exports.flower_delete = async (req, res, next) => {
    const shopId = req.params.shopId;
    const flowerId = req.params.flowerId;
    try {
        if (!isValidId(shopId))
            return res.status(404).send('Not A Valid Shop Id ');

        if (!isValidId(flowerId))
            return res.status(404).send('Not A Valid flower Id ');

        const shop = await Shop.findById(shopId);
        if(!shop){
            const error = new Error('Shop Not Exit.');
            error.statusCode = 404;
            throw error;
        }
  
        const flower = await Flower.findOneAndRemove({ _id: flowerId });
        if(!flower){
            const error = new Error('flower NOT Found , please register a new flower.');
            error.statusCode = 404;
            throw error;
        }
        shop.totalFlowerCount -= 1;
        await shop.save();
        return res.status(200).json({  message: 'flower deleted' });
    } catch (error) {
      next(error);
    }
};
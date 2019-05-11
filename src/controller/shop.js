const Shop = require('../models/shop');

exports.create_new_shop = async (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error('No image provided.');
            error.statusCode = 422;
            throw error;
        }
        const shop = await new Shop({
            shopName: req.body.shopName,
            'location.coordinates': [+req.body.lng, +req.body.lat],
            shopImage: req.file.path,
            creationDate: req.body.creationDate
        }).save();
        return res.status(201).json({
            message: "Created shop successfully",
            createdShop: shop
        });
    } catch (error) {
        next(error);
    }
};

exports.getShops = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try {
        const shops = await Shop.find()
          .skip((currentPage - 1) * perPage)
          .limit(perPage);
        const count = await Shop.countDocuments();
        const pageCount =  Math.ceil(count / perPage);
        return res.status(200).json({
            shops,
            totalCount: count,
            pageCount,
            page: currentPage,
            limit: perPage
        });
    } catch (error) {
        next(error);
    }
};

exports.findNearestShop = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try {
        let { lat, lng, radius } = req.query;
        let findQuery = {
            location: {
                $near: {
                    $maxDistance: +radius,
                    $geometry: {
                        type: 'point',
                        coordinates: [+lng, +lat]
                    }
                }
            }
        };
        const result = await Shop.find(findQuery)
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        const count = await Shop.countDocuments();
        const pageCount = Math.ceil(count / perPage); 
        return res.status(200).json({
            data: result,
            totalCount: count,
            pageCount,
            page: currentPage,
            limit: perPage
        });
    } catch (error) {
        next(error);
    }
};

exports.get_shop_ById = async (req, res, next) => {
    try {
        const shop = await Shop.findById(req.params.shopId);
        if(!shop){
            const error = new Error('No valid entry found for provided ID.');
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({ shop: shop });
    } catch (error) {
        next(error);
    }
};

exports.Update_shop = async (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error('No image provided.');
            error.statusCode = 422;
            throw error;
        }
        req.body.shopImage = req.file.path;

        const shop = await Shop.findOneAndUpdate({ _id: req.params.shopId }, req.body);
        if (!shop) {
            const error = new Error('Shop NOT Found , please register.');
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({
            message: 'shop updated',
            updatedShop: {
                shopName: req.body.shopName,
                shopImage: req.body.shopImage,
                location: req.body.location,
                creationDate: req.body.creationDate
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.delete_shop = async (req, res, next) => {
    try {
      const shop = await Shop.findByIdAndRemove({ _id: req.params.shopId });
      if (!shop) {
        const error = new Error('can not find such a shop with the entered id ,  it may be deleted before.');
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json({ message: 'shop deleted' });
    } catch (error) {
      next(error);
    }
};

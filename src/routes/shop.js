const express = require('express');
const passport = require('passport')
const upload = require('../services/multer');
const shopController = require('../controller/shop');
const authenticate = require('../services/passport')(passport);

const router = express.Router();

router.post(
    '/',
    authenticate.authenticate(),
    upload.single('shopImage'),
    shopController.create_new_shop
);

router.get('/', authenticate.authenticate(), shopController.getShops);

router.get('/near', authenticate.authenticate(), shopController.findNearestShop);

router.get('/:shopId', authenticate.authenticate(), shopController.get_shop_ById);

router.patch(
    '/:shopId', 
    upload.single('shopImage'), authenticate.authenticate(),
    shopController.Update_shop
);

router.delete('/:shopId', authenticate.authenticate(), shopController.delete_shop);

module.exports = router;

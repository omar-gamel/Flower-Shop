const express = require('express');
const passport = require('passport')
const upload = require('../services/multer');
const flowerController = require('../controller/flower');
const authenticate = require('../services/passport')(passport);

const router = express.Router();


router.post('/:shopId', authenticate.authenticate(), upload.single('flowerImage'), flowerController.create_new_flower);

router.get('/:shopId', authenticate.authenticate(), flowerController.get_All_Shop_Flowers);

router.get('/:shopId/flowers/:flowerId', authenticate.authenticate(), flowerController.Flower_get_ById);

router.patch(
    '/:shopId/flowers/:flowerId',
    upload.single('flowerImage'),
    authenticate.authenticate(),
    flowerController.flower_patch
);

router.delete('/:shopId/flowers/:flowerId', authenticate.authenticate(), flowerController.flower_delete);

module.exports = router;
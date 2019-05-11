const express = require('express');
const passport = require('passport')
const cartController = require('../controller/cart');
const authenticate = require('../services/passport')(passport);

const router = express.Router();

router.post('/:flowerId', authenticate.authenticate(), cartController.add_to_cart);

router.get('/', authenticate.authenticate(), cartController.get_cart);

module.exports = router;

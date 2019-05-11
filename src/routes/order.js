const express = require('express');
const passport = require('passport')
const orderController = require('../controller/order');
const authenticate = require('../services/passport')(passport);

const router = express.Router();

router.get('/', authenticate.authenticate(), orderController.get_All_User_Orders);

router.post('/checkout', authenticate.authenticate(), orderController.checkout);

module.exports = router;
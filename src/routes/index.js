const express = require('express');
const passport = require('passport')
const flowerController = require('../controller/flower');
const authenticate = require('../services/passport')(passport);

const router = express.Router();

router.get('/flowers', authenticate.authenticate(), flowerController.get_All_Flowers);

module.exports = router;
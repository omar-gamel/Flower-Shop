const express = require('express');
const passport = require('passport')
const favController = require('../controller/fav');
const authenticate = require('../services/passport')(passport);

const router = express.Router();

router.post('/:flowerId', authenticate.authenticate(), favController.addToFav);

router.get('/', authenticate.authenticate(), favController.getAllFavFllowers);

router.delete('/:flowerId', authenticate.authenticate(), favController.removeFav);

module.exports = router;

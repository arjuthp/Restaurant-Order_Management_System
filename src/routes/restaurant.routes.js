const express = require('express');
const router = express.Router();
const {getRestaurantInfo, updateRestaurantInfo} = require('../controllers/restaurant.controller');
const { authorize} = require('../auth/auth.middlewares');


router.get('/', getRestaurantInfo);

//private=> admin only
router.patch('/', authorize('admin'),updateRestaurantInfo);


module.exports = router;
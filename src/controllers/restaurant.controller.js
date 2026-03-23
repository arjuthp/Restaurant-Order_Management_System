const RestaurantService = require('../service/restaurant.service');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const restaurantService = new RestaurantService();

async function getRestaurantInfo(req, res) {
    try{
        const restaurant = await restaurantService.getRestaurantInfo();
        res.status(200).json(successResponse(restaurant));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function updateRestaurantInfo(req, res) {
    try{
        const restaurant = await restaurantService.updateRestaurantInfo(req.body);
        res.status(200).json(successResponse(restaurant, 'Restaurant info updated successfully'));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

module.exports = {
    getRestaurantInfo,
    updateRestaurantInfo
};
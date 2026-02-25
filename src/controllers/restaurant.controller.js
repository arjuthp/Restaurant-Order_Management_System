const RestaurantService = require('../service/restaurant.service');

const restaurantService = new RestaurantService();

async function getRestaurantInfo(req, res) {
    try{
        const restaurant = await restaurantService.getRestaurantInfo();
        res.status(200).json(restaurant);
    }catch(error){
        const status = error.json || 500;
        res.status(status).json({message: error.message});
    }
}

async function updateRestaurantInfo(req, res) {
    try{
        const restaurant = await restaurantService.updateRestaurantInfo(req.body);
        res.status(200).json(restaurant);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

module.exports = {
    getRestaurantInfo,
    updateRestaurantInfo
};
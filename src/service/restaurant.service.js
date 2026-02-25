const Restaurant = require('../models/restaurant.model');

class RestaurantService{

    async getRestaurantInfo(){
        let restaurant = await Restaurant.findOne();


        if(!restaurant){
            restaurant = await Restaurant.create({
                name: 'Our Restaurant',
                description: 'Welcome to our restaurant ! We serve delicious food',
                address: '123 Main Street, City, COuntry',
                phone: '+1234567890',
                opening_hours: 'MOM_SUN : 9:00 AM - 10:)) PM'
            });
        }
        return restaurant;
    }

    async  updateRestaurantInfo(updateData) {
        let restaurant = await Restaurant.findOne();

        if(!restaurant){
            restaurant = await Restaurant.create(updateData);
        }else{
            restaurant = await Restaurant.findByIdAndUpdate(
                restaurant._id,
                updateData,
                {new: true, runValidators: true}
            );
        }
        if(!restaurant){
            throw {status: 404, message: "Restaurant not found"};
        }
        return restaurant;
    }

}
module.exports = RestaurantService;
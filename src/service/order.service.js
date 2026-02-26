const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

class OrderService {
    async createOrder(userId, notes = null){
        const cart = await Cart.findOne({user_id: userId}).populate('items.product_id');

        if(!cart || cart.items.length === 0){
            throw {status: 400, message: 'Cart is empty. Add items before placing order.'};
        }

        let totalPrice = 0;
        const orderItems = cart.items.map(item => {
            totalPrice += item.unit_price * item.quantity;
             return{
                product_id: item.product_id._id,
                quantity: item.quantity,
                unit_price: item.unit_price
            };
        });

        const order = await Order.create({
            user_id: userId,
            items: orderItems,
            total_price: totalPrice,
            notes: notes,
            status: 'pending'
        });

        cart.items = [];
        await cart.save();

        return await Order.findById(order._id).populate('items.product_id');
    }

    async getMyOrders(userId){
        const orders = await Order.find({user_id: userId})
            .populate('items.product_id')
            .sort({ createdAt: -1});
        return orders;
    }

    async getOrderById(userId, orderId){
        const order = await Order.findById(orderId)
        .populate('user_id', 'name email phone')
        .populate('items.product_id');

        if(!order){
            throw { status: 404, message: 'Order not found'};
        }
        if(userRole === 'customer' && order.user_id.toString() !== userId){
            throw {status: 403, message: 'Access denied.This is not your  order.'};
        }
        return order;
    }

    async getAllOrders(){
        const orders = await Order.find()
            .populate('user_id', 'name email phone')
            .populate('items.product_id')
            .sort({createdAt: -1});
        return orders;
    }

    async updateOrderStatus(orderId, newStatus){
        const validStatuses = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'];

        if(!validStatuses.includes(newStatus)){
            throw { status: 400, message: `Invalid status. Must  be one of: ${validStatuses.join(', ')}`};
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            {status: newStatus},
            {new: true, runValidators: true}
        ).populate('items.product_id');

        if(!order){
            throw {status: 404, message: "Order not found"};
        }
        return order;
    }

    async cancelOrder(userId, orderId){
        const order = await Order.findById(orderId);

        if(!order){
            throw {status: 404, message: 'Order not found'};
        }

        if(order.user_id.toString() !== userId){
            throw { status: 403, message: 'Access denied this is not your order.'};
        }

        if(order.status !== 'pending'){
            throw { status: 400, message: `Cannot cancel order with status: ${order.status}`};
        }
        order.status = 'cancelled';
        await order.save();

        return await Order.findById(orderId).populate('items.product_id');
    }

} 

module.exports = OrderService;
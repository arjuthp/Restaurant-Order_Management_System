const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Reservation = require('../models/reservation.model');

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
                product_name: item.product_id.name,
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
            .sort({ createdAt: -1});//newest to oldest
        return orders;
    }

    async getOrderById(userId, orderId, userRole){
        const order = await Order.findById(orderId)
        .populate('user_id', 'name email phone')
        .populate('items.product_id');

        if(!order){
            throw { status: 404, message: 'Order not found'};
        }
        if(userRole === 'customer' && order.user_id._id.toString() !== userId){
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

    async createPreOrderForReservation(userId, reservationId, notes = null ){
        ///1. verify reservation exists and belongs to user
        const reservation = await Reservation.findById(reservationId)
        .populate('table', 'tableNumber capacity location');

        //check if reservaiton exists
        if(!reservation){
            throw {
                status: 404,
                message: 'Reservation not found'
            };
        }

        //ensure this reservation belongs to the logged in user
        if(reservation.user.toString() !== userId.toString()){
            throw {
                status: 403,
                message: 'You can only create pre-orders for your own reservations'
            };
        }

        //2.Check Reservations status
        if(reservation.status === 'cancelled'){
            throw {
                status: 400,
                message: 'Cannot create pre-order for cancelled reservation'
            };
        }

        if (reservation.status === 'completed'){
            throw {
                status: 400,
                message: 'Cannot create pre-order for completed reservation'
            };
        }

        //3. check  if pre-order already exists to prevent duplications
        if(reservation.hasPreOrder){   
            throw { 
            status: 400,
            message: 'This reservation already has a pre-order. Please modify the existing order.'
            };
        }

        //4. Fetch and Validate Cart
        const cart = await Cart.findOne({user_id: userId })
        .populate('items.product_id');

        if(!cart || cart.items.length === 0){
            throw {
                status: 400,
                message: 'Cart is empty. Add items before creating pre-order.'
            };
        }

        //5. Prepare order items and calculat etotal
        //map cart items to order format

        let totalPrice = 0;
        const orderItems = cart.items.map(item => {
            totalPrice += item.unit_price * item.quantity;
            return {
                product_id: item.product_id._id,
                product_name: item.product_id.name,
                quantity: item.quantity,
                unit_price: item.unit_price
            };
        });

        //6. Create Order with reservation link
        //save order with all details + link to reservation + table
        const order = await Order.create({
            user_id: userId,//who ordered
            items: orderItems, //what they ordered
            total_price: totalPrice,//how muc costs
            notes: notes ,//special instructions
            status: 'pending',//initial status
            orderType: 'dine-in', //pre-order always dine in
            table: reservation.table._id, //which table (from reservation)
            reservation: reservationId //link to reservation
        });

        //7. UPDATE reservation with order reference
        reservation.preOrder = order._id; //link orderid
        reservation.hasPreOrder = true; //mark as having pre-order
        await reservation.save();

        //8. clear cart = remove all items from cart
        cart.items = [];
        await cart.save();

        //9. return complete order with details
        return await Order.findById(order._id)
            .populate('items.product_id')
            .populate('table', 'tableNumber capacity location')
            .populate('reservation', 'date timeSlot numberOfGuests');


    }
}

module.exports = OrderService;
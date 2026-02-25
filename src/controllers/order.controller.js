const OrderService = require('../service/order.service');

const orderService = new OrderService();

//customer: Create order from cart
async function createOrder(req, res) {
    try{
        const { notes } = req.body;
        const order = await orderService.createOrder(req.user.id, notes);
        res.status(201).json(order);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

//customer: Get my orders
async function getMyOrders(req, res) {
    try{
        const orders = await orderService.getMyOrders(req.user.id);
        res.status(200).json(orders);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

//customer: Get singel order
async function getOrderById(req, res) {
    try{
        const order = await orderService.getOrderById(req.user.id, req.params.id);
        res.status(200).json(order);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

//Admin: Get all orders
async function getAllOrders(req, res) {
    try{
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

//Admin: Update order Status
async function updateOrderStatus(req, res) {
    try{
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({message: 'Status is required'});
        }
        const order = await orderService.updateOrderStatus(req.params.id, status);
        res.status(200).json(order);
    }catch(error){
        const statusCode = error.status || 500;
        res.status(statusCode).json({message: error.message});
    }
}

//customer : cancel order
async function cancelOrder(req, res) {
    try{
    const order = await orderService.cancelOrder(req.user.id, req.params.id);
    res.status(200).json(order);
    }catch(error){
        const statusCode = error.status || 500;
        res.status(statusCode).json({message: error.message});
    }
}

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder

}
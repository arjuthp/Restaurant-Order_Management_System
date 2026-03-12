const OrderService = require('../service/order.service');

const orderService = new OrderService();

async function createOrder(req, res) {
    try{
        const {itemsToOrder, notes } = req.body;

        if(itemsToOrder !== undefined && itemsToOrder !== null){
            if(!Array.isArray(itemsToOrder)){
                return res.status(400).json({
                    message: 'itemsToOrder must be an array'
                });
            }
            if(itemsToOrder.length === 0){
                return res.status(400).json({
                    message: 'itemsToOrder cannot be an empty array'
                });
            }
        }

        const order = await orderService.createOrder(req.user.id,itemsToOrder, notes);
        res.status(201).json(order);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function getMyOrders(req, res) {
    try{
        const orders = await orderService.getMyOrders(req.user.id);
        res.status(200).json(orders);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function getAvailableProducts(req, res){
    try{
        const products = await ProductService.getAvailableProducts();
        res.status(200).json(products);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function getOrderById(req, res) {
    try{
        console.log("User Role", req.user.role);
        const order = await orderService.getOrderById(req.user.id, req.params.id, req.user.role);
        res.status(200).json(order);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function getAllOrders(req, res) {
    try{
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

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

async function cancelOrder(req, res) {
    try{
    const order = await orderService.cancelOrder(req.user.id, req.params.id);
    res.status(200).json(order);
    }catch(error){
        const statusCode = error.status || 500;
        res.status(statusCode).json({message: error.message});
    }
}

async function createPreOrderForReservation(req, res) {
    try {
        //extract reservationID from URL parametes
        const { reservationId } = req.params;
        
        //extract notes from req body
        const { notes } = req.body;
        //call service to create pre-order
        const order = await orderService.createPreOrderForReservation(
            req.user.id,
            reservationId,
            notes
        );
        //send success response
        res.status(201).json({
            success: true,
            message: 'Pre-order created successfully',
            data: order
        });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createOrder,
    getMyOrders,
    getAvailableProducts,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    createPreOrderForReservation
}
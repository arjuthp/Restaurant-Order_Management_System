const OrderService = require('../service/order.service');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const orderService = new OrderService();

async function createOrder(req, res) {
    try{
        console.log('[DEBUG] [CREATE ORDER] Request body:', JSON.stringify(req.body, null, 2));
        console.log('[DEBUG] [CREATE ORDER] itemsToOrder type:', typeof req.body.itemsToOrder);
        console.log('[DEBUG] [CREATE ORDER] itemsToOrder value:', req.body.itemsToOrder);
        
        const {itemsToOrder, notes } = req.body;

        // Validation is handled by validateCreateOrder middleware
        const order = await orderService.createOrder(req.user.id,itemsToOrder, notes);
        res.status(201).json(successResponse(order, 'Order created successfully'));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function getMyOrders(req, res) {
    try{
        
        const result = await orderService.getMyOrders(req.user.id,req.query);
        
        // Send response with pagination
        res.status(200).json(
            successResponse(result.orders, null, result.pagination)
        );
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function getAvailableProducts(req, res){
    try{
        const products = await ProductService.getAvailableProducts();
        res.status(200).json(successResponse(products));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function getOrderById(req, res) {
    try{
        console.log("User Role", req.user.role);
        const order = await orderService.getOrderById(req.user.id, req.params.id, req.user.role);
        res.status(200).json(successResponse(order));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function getAllOrders(req, res) {
    try{
     
        
        const result = await orderService.getAllOrders(req.query);
        
        // Send response with pagination
        res.status(200).json(
            successResponse(result.orders, null, result.pagination)
        );
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function updateOrderStatus(req, res) {
    try{
        const { status } = req.body;
        if (!status) {
            return res.status(400).json(errorResponse('Status is required', 400));
        }
        const order = await orderService.updateOrderStatus(req.params.id, status);
        res.status(200).json(successResponse(order, 'Order status updated successfully'));
    }catch(error){
        const statusCode = error.status || 500;
        res.status(statusCode).json(errorResponse(error.message, statusCode));
    }
}

async function cancelOrder(req, res) {
    try{
    const order = await orderService.cancelOrder(req.user.id, req.params.id);
    res.status(200).json(successResponse(order, 'Order cancelled successfully'));
    }catch(error){
        const statusCode = error.status || 500;
        res.status(statusCode).json(errorResponse(error.message, statusCode));
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
        res.status(201).json(successResponse(order, 'Pre-order created successfully'));
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
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
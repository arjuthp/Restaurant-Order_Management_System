
async function cancelOrder(userId, orderId){
    //order fetch
    const order = await Order.findById(orderId);

    //validate order existence
    if(!order){
        throw {
            status: 404,
            message: 'Order not found '
        }
//order ownership check
    }
     if(order.user_id.toString() !== userId){
        throw {
            status: 403, message: `Access denied `
        }
     }
     if(order.status !=='pending'){
        throw{status: 403,
            message: `cannot cancel order : ${order.status};`
        }
     }
     order.status ='cancelled';
     await order.save();//save to db

return await Order.findById(orderId).populate('item.product_id');

}
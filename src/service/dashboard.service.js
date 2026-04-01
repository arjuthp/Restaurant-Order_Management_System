const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const User = require('../models/user.model');

class DashboardService {
    async getDashboardStats() {
        // Run all queries in parallel for better performance
        const [
            productStats,
            orderStats,
            cartStats,
            userStats,
            categoryStats,
            recentOrders
        ] = await Promise.all([
            this.getProductStats(),
            this.getOrderStats(),
            this.getCartStats(),
            this.getUserStats(),
            this.getCategoryStats(),
            this.getRecentOrders()
        ]);

        return {
            products: productStats,
            orders: orderStats,
            carts: cartStats,
            users: userStats,
            categories: categoryStats,
            recentActivity: recentOrders
        };
    }

    async getProductStats() {
        const total = await Product.countDocuments({ is_deleted: false });
        const available = await Product.countDocuments({ is_deleted: false, is_available: true });
        const outOfStock = await Product.countDocuments({ is_deleted: false, quantity: 0 });
        const lowStock = await Product.countDocuments({
            is_deleted: false,
            $expr: { $lte: ['$quantity', '$low_stock_threshold'] },
            quantity: { $gt: 0 }
        });

        return { total, available, outOfStock, lowStock };
    }

    async getOrderStats() {
        const totalOrders = await Order.countDocuments();
        
        const revenueResult = await Order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$total_price' } } }
        ]);
        
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const statusBreakdown = await Order.aggregate([
            { $group: { _id: '$status', count: { $count: {} } } }
        ]);

        return {
            totalOrders,
            totalRevenue,
            avgOrderValue,
            statusBreakdown
        };
    }

    async getCartStats() {
        const activeCarts = await Cart.countDocuments();
        
        const cartItemsResult = await Cart.aggregate([
            { $unwind: '$items' },
            { $group: { _id: null, totalItems: { $sum: '$items.quantity' } } }
        ]);
        
        const totalCartItems = cartItemsResult.length > 0 ? cartItemsResult[0].totalItems : 0;

        return { activeCarts, totalCartItems };
    }

    async getUserStats() {
        const totalUsers = await User.countDocuments({ role: 'customer' });
        
        // Users who have placed at least one order
        const activeCustomers = await Order.distinct('user_id').then(ids => ids.length);

        return { totalUsers, activeCustomers };
    }

    async getCategoryStats() {
        const stats = await Product.aggregate([
            { $match: { is_deleted: false } },
            { $group: { _id: '$category', count: { $count: {} } } },
            { $sort: { count: -1 } },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } }
        ]);

        return stats.map(s => ({ 
            category: s.categoryInfo ? s.categoryInfo.name : 'Unknown', 
            count: s.count 
        }));
    }


    async getRecentOrders(limit = 10) {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('user_id', 'name email')
            .select('total_price status createdAt');

        return orders;
    }
}

module.exports = DashboardService;

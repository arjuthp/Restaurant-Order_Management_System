const DashboardService = require('../service/dashboard.service');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const dashboardService = new DashboardService();

async function getDashboardStats(req, res) {
    try{ 
        const stats = await dashboardService.getDashboardStats();
        res.status(200).json(successResponse(stats, 'Dashboard stats retrieved successfully'));
    }catch(error){
        console.error('Error in getDashboardStats:', error);
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

module.exports = { getDashboardStats };
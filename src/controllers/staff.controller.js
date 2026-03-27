const StaffService = require('../service/staff.service');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const staffService = new StaffService();

/**
 * Create a new staff member
 * POST /api/admin/staff
 */
async function createStaff(req, res) {
    try {
        const { name, email, password, phone, roleId, employeeId, hireDate } = req.body;
        
        // Call service to create staff
        const staff = await staffService.createStaff({
            name,
            email,
            password,
            phone,
            roleId,
            employeeId,
            hireDate
        });
        
        res.status(201).json(
            successResponse(staff, 'Staff created successfully')
        );
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

/**
 * Get all staff with pagination, search, and filters
 * GET /api/admin/staff?page=1&limit=10&search=john&roleId=xxx&isActive=true
 */
async function getAllStaff(req, res) {
    try {
        // Extract query params
        const filters = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            search: req.query.search,
            roleId: req.query.roleId,
            isActive: req.query.isActive
        };
        
        const result = await staffService.getAllStaff(filters);
        
        res.status(200).json(
            successResponse(result.staff, null, result.pagination)
        );
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

/**
 * Get staff by ID
 * GET /api/admin/staff/:id
 */
async function getStaffById(req, res) {
    try {
        const staff = await staffService.getStaffById(req.params.id);
        
        res.status(200).json(
            successResponse(staff)
        );
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

/**
 * Update staff
 * PUT /api/admin/staff/:id
 */
async function updateStaff(req, res) {
    try {
        const { name, email, password, phone, roleId, employeeId, hireDate } = req.body;
        
        const staff = await staffService.updateStaff(req.params.id, {
            name,
            email,
            password,
            phone,
            roleId,
            employeeId,
            hireDate
        });
        
        res.status(200).json(
            successResponse(staff, 'Staff updated successfully')
        );
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

/**
 * Toggle staff status (activate/deactivate)
 * PATCH /api/admin/staff/:id/status
 */
async function toggleStaffStatus(req, res) {
    try {
        const { isActive } = req.body;
        
        const staff = await staffService.toggleStaffStatus(req.params.id, isActive);
        
        const message = isActive ? 'Staff activated successfully' : 'Staff deactivated successfully';
        
        res.status(200).json(
            successResponse(staff, message)
        );
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

module.exports = {
    createStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    toggleStaffStatus
};

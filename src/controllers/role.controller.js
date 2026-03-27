const RoleService = require('../service/role.service');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const roleService = new RoleService();

/**
 * Create a new role
 * POST /api/admin/roles
 */
async function createRole(req, res) {
    try {
        const { name, description } = req.body;
        
        // Call service to create role
        const role = await roleService.createRole(name, description);
        
        res.status(201).json(
            successResponse(role, 'Role created successfully')
        );
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

/**
 * Get all roles with optional filters
 * GET /api/admin/roles?isActive=true
 */
async function getAllRoles(req, res) {
    try {
        // Extract query filters
        const filters = {
            isActive: req.query.isActive
        };
        
        const roles = await roleService.getAllRoles(filters);
        
        res.status(200).json(
            successResponse(roles)
        );
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

/**
 * Get role by ID
 * GET /api/admin/roles/:id
 */
async function getRoleById(req, res) {
    try {
        const role = await roleService.getRoleById(req.params.id);
        
        res.status(200).json(
            successResponse(role)
        );
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

/**
 * Update role
 * PUT /api/admin/roles/:id
 */
async function updateRole(req, res) {
    try {
        const { name, description, isActive } = req.body;
        
        const role = await roleService.updateRole(req.params.id, {
            name,
            description,
            isActive
        });
        
        res.status(200).json(
            successResponse(role, 'Role updated successfully')
        );
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

/**
 * Toggle role status (activate/deactivate)
 * PATCH /api/admin/roles/:id/status
 */
async function toggleRoleStatus(req, res) {
    try {
        const { isActive } = req.body;
        
        const role = await roleService.toggleRoleStatus(req.params.id, isActive);
        
        const message = isActive ? 'Role activated successfully' : 'Role deactivated successfully';
        
        res.status(200).json(
            successResponse(role, message)
        );
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    toggleRoleStatus
};

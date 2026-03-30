const Role = require('../models/role.model');
const Staff = require('../models/staff.model');

class RoleService {
    async createRole(name, description) {
        // Check if role already exists
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            throw { status: 400, message: 'Role with this name already exists' };
        }

        const role = await Role.create({
            name,
            description
        });

        return role;
    }

    async getAllRoles(filters = {}) {
        const query = {};
        
        // Apply isActive filter if provided
        if (filters.isActive !== undefined) {
            query.isActive = filters.isActive === 'true' || filters.isActive === true;
        }

        const roles = await Role.find(query).sort({ createdAt: -1 });
        return roles;
    }

    async getRoleById(id) {
        const role = await Role.findById(id);
        
        if (!role) {
            throw { status: 404, message: 'Role not found' };
        }
        
        return role;
    }

    async updateRole(id, data) {
        const { name, description, isActive } = data;
        
        // If name is being changed, check uniqueness
        if (name) {
            const existingRole = await Role.findOne({ name, _id: { $ne: id } });
            if (existingRole) {
                throw { status: 400, message: 'Role with this name already exists' };
            }
        }

        const role = await Role.findByIdAndUpdate(
            id,
            { name, description, isActive },
            { new: true, runValidators: true }
        );

        if (!role) {
            throw { status: 404, message: 'Role not found' };
        }

        return role;
    }

    async toggleRoleStatus(id, isActive) {
        // If deactivating, check if role has active staff
        if (isActive === false) {
            const activeStaffCount = await Staff.countDocuments({ 
                roleId: id, 
                isActive: true 
            });
            
            if (activeStaffCount > 0) {
                throw { 
                    status: 400, 
                    message: `Cannot deactivate role. ${activeStaffCount} active staff member(s) are assigned to this role.` 
                };
            }
        }

        const role = await Role.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!role) {
            throw { status: 404, message: 'Role not found' };
        }

        return role;
    }
}

module.exports = RoleService;

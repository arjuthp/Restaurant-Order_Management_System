const Staff = require('../models/staff.model');
const Role = require('../models/role.model');
const bcrypt = require('bcrypt');
const { calculatePagination } = require('../utils/paginationHelper');

class StaffService {
    async createStaff(data) {
        const { name, email, password, phone, roleId, employeeId, hireDate } = data;

        // Validate roleId exists
        const role = await Role.findById(roleId);
        if (!role) {
            throw { status: 400, message: 'Invalid role ID' };
        }

        // Check if role is active
        if (!role.isActive) {
            throw { status: 400, message: 'Cannot assign staff to an inactive role' };
        }

        // Check if email already exists
        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            throw { status: 400, message: 'Staff with this email already exists' };
        }

        // Check if employeeId already exists (if provided)
        if (employeeId) {
            const existingEmployeeId = await Staff.findOne({ employeeId });
            if (existingEmployeeId) {
                throw { status: 400, message: 'Employee ID already exists' };
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate employeeId if not provided
        const finalEmployeeId = employeeId || await this._generateEmployeeId();

        const staff = await Staff.create({
            name,
            email,
            password: hashedPassword,
            phone,
            roleId,
            employeeId: finalEmployeeId,
            hireDate: hireDate || Date.now()
        });

        // Populate role before returning
        await staff.populate('roleId', 'name description');
        return staff;
    }

    async getAllStaff(filters = {}) {
        const { page = 1, limit = 10, search, roleId, isActive } = filters;

        // Build query
        const query = {};

        // Search by name or email
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by roleId
        if (roleId) {
            query.roleId = roleId;
        }

        // Filter by isActive
        if (isActive !== undefined) {
            query.isActive = isActive === 'true' || isActive === true;
        }

        // Count total items
        const totalItems = await Staff.countDocuments(query);

        // Calculate pagination
        const { skip, pagination } = calculatePagination(page, limit, totalItems);

        // Get paginated staff
        const staff = await Staff.find(query)
            .populate('roleId', 'name description')
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return {
            staff,
            pagination
        };
    }

    async getStaffById(id) {
        const staff = await Staff.findById(id)
            .populate('roleId', 'name description')
            .select('-password');

        if (!staff) {
            throw { status: 404, message: 'Staff not found' };
        }

        return staff;
    }

    async updateStaff(id, data) {
        const { name, email, password, phone, roleId, employeeId, hireDate } = data;

        // Validate roleId if changed
        if (roleId) {
            const role = await Role.findById(roleId);
            if (!role) {
                throw { status: 400, message: 'Invalid role ID' };
            }
            if (!role.isActive) {
                throw { status: 400, message: 'Cannot assign staff to an inactive role' };
            }
        }

        // Check email uniqueness if changed
        if (email) {
            const existingStaff = await Staff.findOne({ email, _id: { $ne: id } });
            if (existingStaff) {
                throw { status: 400, message: 'Email already exists' };
            }
        }

        // Check employeeId uniqueness if changed
        if (employeeId) {
            const existingEmployeeId = await Staff.findOne({ employeeId, _id: { $ne: id } });
            if (existingEmployeeId) {
                throw { status: 400, message: 'Employee ID already exists' };
            }
        }

        // Prepare update data
        const updateData = { name, email, phone, roleId, employeeId, hireDate };

        // Hash password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const staff = await Staff.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('roleId', 'name description').select('-password');

        if (!staff) {
            throw { status: 404, message: 'Staff not found' };
        }

        return staff;
    }

    async toggleStaffStatus(id, isActive) {
        const staff = await Staff.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        ).populate('roleId', 'name description').select('-password');

        if (!staff) {
            throw { status: 404, message: 'Staff not found' };
        }

        return staff;
    }

    // Helper method to generate unique employee ID
    async _generateEmployeeId() {
        const count = await Staff.countDocuments();
        return `EMP${String(count + 1).padStart(4, '0')}`; // e.g., EMP0001
    }
}

module.exports = StaffService;

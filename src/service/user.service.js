const User = require('../models/user.model');
const AuthService = require('./auth.service');
const { calculatePagination } = require('../utils/paginationHelper');

class UserService {
    constructor(){
        this.authService = new AuthService();
    }

    async getAllUsers(page = 1, limit = 10){
        //count toal no of users
        const totalItems = await User.countDocuments({});
        //calculate pagination
        const { skip, pagination } = calculatePagination(page, limit, totalItems);
        //get paginated users sorted by creation date (newest first)
        
        const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
        //format users and return with pagination
        return {
            users: users.map(user => this.authService._formatUserResponse(user)),
            pagination
        };
    }

    async getUserById(userId) {
        const user = await User.findById(userId.toString().trim()).select('-password');
        
        if (!user) {
            throw { status: 404, message: 'User not found' };
        }
        
        return this.authService._formatUserResponse(user);
    }

    async updateUser(userId, updateData){
        // Don't allow password/role updates through this method
        const {password, role, ...allowedUpdates } = updateData;

        const user = await User.findByIdAndUpdate(
            userId,
            allowedUpdates,
            {new: true, runValidators: true}
        ).select('-password');

        if(!user){
            throw {status: 404, message: 'User not found'};
        }

        return this.authService._formatUserResponse(user);
    }

    async deleteUser(userId) {
        const user = await User.findByIdAndDelete(userId);z
        
        if (!user) {
            throw { status: 404, message: 'User not found' };
        }
        
        return { message: 'User deleted successfully' };
    }
}

module.exports = UserService;
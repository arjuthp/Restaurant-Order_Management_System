const User = require('../models/user.model');
const AuthService = require('./auth.service');

class UserService {
    constructor(){
        this.authService = new AuthService();
    }

    async getAllUsers(){
        const users = await User.find().select('-password');
        return users.map(user => this.authService._formatUserResponse(user));
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
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            throw { status: 404, message: 'User not found' };
        }
        
        return { message: 'User deleted successfully' };
    }
}

module.exports = UserService;
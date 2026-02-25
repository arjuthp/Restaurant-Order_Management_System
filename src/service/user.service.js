const User = require('../models/user.model');
const AuthService = require('./auth.service');

class UserService {
    constructor(){
        this.authService = new AuthService();
    }

    // Admin: Get all users from database
    async getAllUsers(){
        // Find all users but exclude password field for security
        const users = await User.find().select('-password');
        // Format each user object to return only necessary fields
        return users.map(user => this.authService._formatUserResponse(user));
    }

    // Get single user by their ID
    async getUserById(userId) {
        // Find user by ID, exclude password from result
        const user = await User.findById(userId).select('-password');
        
        // If user doesn't exist, throw 404 error
        if (!user) {
            throw { status: 404, message: 'User not found' };
        }
        
        // Return formatted user data (id, name, email, role only)
        return this.authService._formatUserResponse(user);
    }

    // Update user information (name, email, etc.)
    async updateUser(userId, updateData){
        // Security: Don't allow updating password or role through this method
        // Extract password and role, keep everything else in allowedUpdates
        const {password, role, ...allowedUpdates } = updateData;

        // Update user in database
        // { new: true } returns the updated document instead of old one
        // { runValidators: true } ensures mongoose schema validation runs
        const user = await User.findByIdAndUpdate(
            userId,
            allowedUpdates,
            {new: true, runValidators: true}
        ).select('-password'); // Exclude password from response

        // If user doesn't exist, throw 404 error
        if(!user){
            throw {status: 404, message: 'User not found'};
        }

        // Return formatted updated user data
        return this.authService._formatUserResponse(user);
    }

    // Delete user account permanently
    async deleteUser(userId) {
        // Find and delete user in one operation
        const user = await User.findByIdAndDelete(userId);
        
        // If user doesn't exist, throw 404 error
        if (!user) {
            throw { status: 404, message: 'User not found' };
        }
        
        // Return success message
        return { message: 'User deleted successfully' };
    }
}

module.exports = UserService;
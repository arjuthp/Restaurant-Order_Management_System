const UserService = require('../service/user.service');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const userService = new UserService();

async function getAllUsers(req, res){
    try{
        console.log('getAllUsers controller called');
        // Get pagination params from query
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        console.log('Pagination params:', { page, limit });
        
        const result = await userService.getAllUsers(page, limit);
        console.log('Service returned result:', { usersCount: result.users?.length, pagination: result.pagination });

        const response = successResponse(result, null, null);
        console.log('Sending response:', JSON.stringify(response).substring(0, 200));
        res.status(200).json(response);
    }catch(error){
        console.error('Error in getAllUsers:', error);
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function getUserById(req, res) {
    try{
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(successResponse(user));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function getMyProfile(req, res) {
    try{
         const user = await userService.getUserById(req.user.id);
         res.status(200).json(successResponse(user));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function updateMyProfile(req, res) {
    try{
        const user = await userService.updateUser(req.user.id, req.body);
        res.status(200).json(successResponse(user, 'Profile updated successfully'));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function deleteMyAccount(req, res) {
    try{
        const result = await userService.deleteUser(req.user.id);
        res.status(200).json(successResponse(result, 'Account deleted successfully'));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    getMyProfile,
    updateMyProfile,
    deleteMyAccount
};

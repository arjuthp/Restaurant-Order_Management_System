const UserService = require('../service/user.service');

const userService = new UserService();

async function getAllUsers(req, res){
    try{
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function getUserById(req, res) {
    try{
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function getMyProfile(req, res) {
    try{
         const user = await userService.getUserById(req.user.id);
         res.status(200).json(user);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function updateMyProfile(req, res) {
    try{
        const user = await userService.updateUser(req.user.id, req.body);
        res.status(200).json(user);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function deleteMyAccount(req, res) {
    try{
        const result = await userService.deleteUser(req.user.id);
        res.status(200).json(result);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    getMyProfile,
    updateMyProfile,
    deleteMyAccount
};

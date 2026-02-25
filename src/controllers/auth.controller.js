const AuthService = require('../service/auth.service');

const authService = new AuthService();

async function register (req, res) {
    try{
        const {name, email, password, role} = req.body;
        const result = await authService.registerUser(name, email, password, role);

        res.status(201).json(result);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function login(req, res) {
    try{
        const {email, password} = req.body;
        const result = await authService.loginUser(email, password);

        res.status(200).json(result);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function adminLogin(req, res) {
    try{
        const {email, password} = req.body;
        const result = await authService.loginUser(email, password,'admin');

        res.status(200).json(result);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function refreshToken(req, res) {
    try{
        const {refreshToken} = req.body;

        if(!refreshToken){
            return res.status(401).json({message: 'Refresh token required '});
        }

        const result = await authService.refreshAccessToken(refreshToken);
        res.status(200).json(result);
    }catch(error){
        const status = error.status || 401;
        res.status(status).json({message: error.message});
    }
}

async function logout(req, res) {
    try{
        const {refreshToken} = req.body;

        if(!refreshToken){
            return res.status(400).json({message: 'Refresh token required'});
        }
        const result = await authService.logout(refreshToken);
        res.status(200).json(result);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

module.exports = {
    register,
    login,
    adminLogin,
    refreshToken,
    logout
    
}

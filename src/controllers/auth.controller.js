const AuthService = require('../service/auth.service');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const authService = new AuthService();

async function register(req, res) {
    try {
        const { name, email, password, role, phone, address } = req.body;
        const result = await authService.registerUser(name, email, password, role, phone, address);

        res.status(201).json(successResponse(result, 'Registration successful'));
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);

        res.status(200).json(successResponse(result, 'Login successful'));
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function adminLogin(req, res) {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password, 'admin');

        res.status(200).json(successResponse(result, 'Admin login successful'));
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function refreshToken(req, res) {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json(errorResponse('Refresh token required', 401));
        }

        const result = await authService.refreshAccessToken(refreshToken);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const status = error.status || 401;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function logout(req, res) {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json(errorResponse('Refresh token required', 400));
        }
        const result = await authService.logout(refreshToken);
        res.status(200).json(successResponse(result, 'Logout successful'));
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

module.exports = {
    register,
    login,
    adminLogin,
    refreshToken,
    logout
}

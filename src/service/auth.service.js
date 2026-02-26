const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken');
const {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken}= require('../utils/jwt');

class AuthService {
    constructor(){
        this.tokenExpire = 7 * 24* 60 * 60 * 1000;
        this.saltRounds = 10;
    }

    async _findUserByEmail (email) {
        const user = await User.findOne({email});
        if(!user){
            throw{status: 401, message: 'Invalid Credientials'};
        }
        return user;
    }

    async _findUserById(userId){
        const user = await User.findById(userId);
        if(!user){
            throw {status: 401, message: 'User not found'};
        }
        return user;
    }

    async _verifyPassword(plainPassword, hashedPassword){
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        if(!isMatch){
            throw {status: 401, message: 'Invalid credientials'};
        }
    }

    _checkRole(user, requiredRole){
        if(requiredRole && user.role !== requiredRole){
            throw {status: 403, message: `Access Denied. ${requiredRole} only.`}
        }
    }

    _generateTokens(userId, userRole){
        const accessToken = generateAccessToken(userId, userRole);
        const refreshToken = generateRefreshToken(userId);
        return{accessToken, refreshToken};
    }

    async _storeRefreshToken(userId, refreshToken){
        await RefreshToken.create({
            user_id: userId,
            token: refreshToken,
            expiresAt: new Date(Date.now() + this.tokenExpire)
            
        });
    }

    _formatUserResponse(user){
        return{
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
    }

    async _generateAndStoreTokens(user){
        const {accessToken, refreshToken} = this._generateTokens(user._id,user.role);
        await this._storeRefreshToken(user._id, refreshToken);

        return{
            accessToken,
            refreshToken,
            user: this._formatUserResponse(user)
        };
    }


    async registerUser(name, email, password, role = 'customer'){
        const existingUser = await User.findOne({email});
        if(existingUser){
            throw {status: 400, message: 'Email already Exists'};
        }

        const hashedPassword = await bcrypt.hash(password, this.saltRounds);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'customer'
        });

        return await this._generateAndStoreTokens(user);
    }

    async loginUser(email, password, requiredRole = null){
        const user = await this._findUserByEmail(email);

        this._checkRole(user, requiredRole);
        await this._verifyPassword(password, user.password);
        return await this._generateAndStoreTokens(user);
    }

    async refreshAccessToken(token){
        const storedToken = await RefreshToken.findOne({token});
        if(!storedToken){
            throw {status: 401, message: 'Invalid refresh Token'};
        }

        const decoded = verifyRefreshToken(token);
        const user = await this._findUserById(decoded.id);
        const newAccessToken = generateAccessToken(user._id, user.role);

        return {accessToken: newAccessToken}
    }

    async logout(token){
        const result = await RefreshToken.deleteOne({token});
        if(result.deletedCount === 0){
            throw{status: 404, message: 'Token not found'};
        }
        return{message: 'Logged out Successfully'};
    }

} 

module.exports = AuthService;
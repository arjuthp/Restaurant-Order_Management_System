const {verifyAccessToken} = require('../utils/jwt');
const { errorResponse } = require('../utils/responseFormatter');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json(errorResponse('Access token required', 401));
    }

    try{
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    }catch(error){
        // Return 401 for expired/invalid tokens so frontend can refresh
        if(error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError'){
            return res.status(401).json(errorResponse('Invalid or expired token', 401));
        }
        return res.status(403).json(errorResponse('Authentication failed', 403));
    }
}

function authorize(...allowedRoles){
    return(req, res, next) =>{
        console.log('🔐 [AUTH MIDDLEWARE] Checking authorization for:', req.method, req.url);
        console.log('🔐 [AUTH MIDDLEWARE] Allowed roles:', allowedRoles);
        
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            console.log('❌ [AUTH MIDDLEWARE] No token provided');
            return res.status(401).json(errorResponse('Access token required', 401));
        }

        try{
            const decoded = verifyAccessToken(token);
            req.user = decoded;
            console.log('✅ [AUTH MIDDLEWARE] Token verified, user role:', req.user.role);

            if(!allowedRoles.includes(req.user.role)){
                console.log('❌ [AUTH MIDDLEWARE] Access denied, user role:', req.user.role);
                return res.status(403).json(errorResponse(`Access denied. Required role: ${allowedRoles.join(' or ')}`, 403));
            }
            
            console.log('✅ [AUTH MIDDLEWARE] Authorization successful');
            next();
        }catch(error){
            console.log('❌ [AUTH MIDDLEWARE] Token verification failed:', error.message);
            // Return 401 for expired/invalid tokens so frontend can refresh
            if(error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError'){
                return res.status(401).json(errorResponse('Invalid or expired token', 401));
            }
            return res.status(403).json(errorResponse('Authentication failed', 403));
        }
    }
}

module.exports = {verifyToken, authorize};
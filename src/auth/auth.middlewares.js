
const {verifyAccessToken} = require('../utils/jwt');
function verifyToken(req, res, next) {
    //get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({message: 'Access token required'});
    }

    try{
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(403).json({message: 'Invalid or expired token'});
    }
}

function authorize(...allowedRoles){
    return(req, res, next) =>{
        // Get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            return res.status(401).json({message: 'Access token required'});
        }

        try{
            const decoded = verifyAccessToken(token);
            req.user = decoded;

            // Check if user has required role
            if(!allowedRoles.includes(req.user.role)){
                return res.status(403).json({
                    message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
                });
            }
            
            next();
        }catch(error){
            return res.status(403).json({message: 'Invalid or expired token'});
        }
    }
}

module.exports = {verifyToken, authorize};
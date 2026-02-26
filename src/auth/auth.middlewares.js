const {verifyAccessToken} = require('../utils/jwt');

function verifyToken(req, res, next) {
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
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            return res.status(401).json({message: 'Access token required'});
        }

        try{
            const decoded = verifyAccessToken(token);
            req.user = decoded;

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
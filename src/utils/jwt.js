const jwt = require('jsonwebtoken');

function generateAccessToken(userId, role) {
    return jwt.sign(
        {id: userId, role},
        process.env.JWT_ACCESS_SECRET,
        {expiresIn: '15m'}
    );
};

function generateRefreshToken(userId) {
    return jwt.sign(
        {id: userId},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:'7d'}
    );
};

function verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

function verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,

}
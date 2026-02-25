const express = require('express');
const {register, login, adminLogin, refreshToken, logout} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

module.exports = router;


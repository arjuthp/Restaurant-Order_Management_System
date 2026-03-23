const express = require('express');
const {register, login, adminLogin, refreshToken, logout} = require('../controllers/auth.controller');

const { validateRegister, validateLogin } = require('../validators/auth.validator');


const router = express.Router();

router.post('/register',validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/admin/login',validateLogin, adminLogin);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

module.exports = router;


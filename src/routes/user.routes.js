const express = require('express');
const router = express.Router();
const { getAllUsers, getMyProfile, updateMyProfile, deleteMyAccount }= require('../controllers/user.controller');

const {authorize} = require('../auth/auth.middlewares');

//admin route 
router.get('/', authorize('admin'),getAllUsers);

//customer route
router.get('/me', authorize('customer'), getMyProfile);
router.patch('/me', authorize('customer'), updateMyProfile);
router.delete('/me', authorize('customer'), deleteMyAccount);

module.exports = router; 
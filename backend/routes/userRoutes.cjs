const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.cjs');
const auth = require('../middleware/auth.cjs');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', userController.registerUser);

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', userController.loginUser);

// @route   GET api/users/me
// @desc    Get user data
// @access  Private
router.get('/me', auth, userController.getMe);

module.exports = router;
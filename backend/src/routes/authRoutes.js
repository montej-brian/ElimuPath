const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiters');
const { validate, authSchemas } = require('../middleware/validation');

// @route   POST /auth/register
// @desc    Register user
// @access  Public
router.post('/register', authLimiter, validate(authSchemas.register), authController.register);

// @route   POST /auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authLimiter, validate(authSchemas.login), authController.login);

// @route   GET /auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, authController.getMe);

module.exports = router;

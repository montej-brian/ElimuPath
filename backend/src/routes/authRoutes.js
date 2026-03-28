const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const googleAuthController = require('../controllers/googleAuthController');
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

// @route   POST /auth/google
// @desc    Sign in or register via Google OAuth
// @access  Public
router.post('/google', authLimiter, googleAuthController.googleAuth);

// @route   POST /auth/logout
// @desc    Clear auth cookie
// @access  Private
router.post('/logout', authController.logout);

module.exports = router;

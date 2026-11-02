const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    check('name', 'Name is required and cannot be empty').trim().notEmpty(),
    check('email', 'Please provide a valid email address').isEmail().normalizeEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
  ],
  register
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Please provide a valid email address').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

// @route   GET /api/auth/profile
router.get('/profile', protect, getProfile);

// @route   PUT /api/auth/profile
router.put(
  '/profile',
  protect,
  [
    check('name', 'Name cannot be empty if provided').optional().trim().notEmpty(),
    check('email', 'Please provide a valid email address').optional().isEmail().normalizeEmail()
  ],
  updateProfile
);

// @route   PUT /api/auth/change-password
router.put(
  '/change-password',
  protect,
  [
    check('currentPassword', 'Current password is required').notEmpty(),
    check('newPassword', 'New password must be at least 6 characters long').isLength({ min: 6 })
  ],
  changePassword
);

module.exports = router;

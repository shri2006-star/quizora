const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById
} = require('../controllers/authController');

const { protect, adminOnly } = require('../middleware/auth');

// All user management routes are restricted to admin
router.use(protect, adminOnly);

// @route   GET /api/users
router.get('/', getAllUsers);

// @route   GET /api/users/:id
router.get('/:id', getUserById);

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  getAdminStats
} = require('../controllers/resultController');

const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/stats/dashboard
router.get('/dashboard', protect, getDashboardStats);

// @route   GET /api/stats/admin
router.get('/admin', protect, adminOnly, getAdminStats);

module.exports = router;

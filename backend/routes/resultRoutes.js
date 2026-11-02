const express = require('express');
const router = express.Router();

const {
  getMyResults,
  getResultById,
  getAllResults
} = require('../controllers/resultController');

const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/results/my
router.get('/my', protect, getMyResults);

// @route   GET /api/results/:id
router.get('/:id', protect, getResultById);

// @route   GET /api/results
router.get('/', protect, adminOnly, getAllResults);

module.exports = router;

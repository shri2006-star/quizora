const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const {
  startQuiz,
  submitQuiz
} = require('../controllers/quizController');

const { protect } = require('../middleware/auth');

// @route   POST /api/quiz/start
router.post(
  '/start',
  protect,
  [
    check('categoryId', 'Valid Category ID is required to start quiz').isMongoId()
  ],
  startQuiz
);

// @route   POST /api/quiz/submit
router.post(
  '/submit',
  protect,
  [
    check('categoryId', 'Valid Category ID is required').isMongoId(),
    check('answers', 'Answers must be provided as an array').isArray(),
    check('timeTaken', 'Time taken must be a valid number of seconds').optional().isNumeric()
  ],
  submitQuiz
);

module.exports = router;

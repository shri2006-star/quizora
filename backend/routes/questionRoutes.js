const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/questionController');

const { protect, adminOnly } = require('../middleware/auth');

// All question management routes are restricted to admin
router.use(protect, adminOnly);

// @route   GET /api/questions
router.get('/', getQuestions);

// @route   GET /api/questions/:id
router.get('/:id', getQuestionById);

// @route   POST /api/questions
router.post(
  '/',
  [
    check('categoryId', 'Valid Category ID is required').isMongoId(),
    check('questionText', 'Question text is required').trim().notEmpty(),
    check('options', 'Options must be an array of 4 items').isArray({ min: 4, max: 4 }),
    check('correctAnswer', 'Correct answer must be an integer between 0 and 3').isInt({ min: 0, max: 3 }),
    check('difficulty', 'Difficulty must be Easy, Medium, or Hard')
      .optional()
      .isIn(['Easy', 'Medium', 'Hard'])
  ],
  createQuestion
);

// @route   PUT /api/questions/:id
router.put(
  '/:id',
  [
    check('categoryId', 'Invalid Category ID').optional().isMongoId(),
    check('questionText', 'Question text cannot be empty').optional().trim().notEmpty(),
    check('options', 'Options must be an array of 4 items').optional().isArray({ min: 4, max: 4 }),
    check('correctAnswer', 'Correct answer must be an integer between 0 and 3').optional().isInt({ min: 0, max: 3 }),
    check('difficulty', 'Difficulty must be Easy, Medium, or Hard')
      .optional()
      .isIn(['Easy', 'Medium', 'Hard'])
  ],
  updateQuestion
);

// @route   DELETE /api/questions/:id
router.delete('/:id', deleteQuestion);

module.exports = router;

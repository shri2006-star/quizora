const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/categories
router.get('/', getCategories);

// @route   GET /api/categories/:id
router.get('/:id', getCategoryById);

// @route   POST /api/categories
router.post(
  '/',
  protect,
  adminOnly,
  [
    check('name', 'Category name is required').trim().notEmpty(),
    check('description', 'Category description is required').trim().notEmpty(),
    check('difficulty', 'Difficulty must be Easy, Medium, or Hard')
      .optional()
      .isIn(['Easy', 'Medium', 'Hard']),
    check('status', 'Status must be active or inactive')
      .optional()
      .isIn(['active', 'inactive'])
  ],
  createCategory
);

// @route   PUT /api/categories/:id
router.put(
  '/:id',
  protect,
  adminOnly,
  [
    check('name', 'Category name cannot be empty').optional().trim().notEmpty(),
    check('description', 'Category description cannot be empty').optional().trim().notEmpty(),
    check('difficulty', 'Difficulty must be Easy, Medium, or Hard')
      .optional()
      .isIn(['Easy', 'Medium', 'Hard']),
    check('status', 'Status must be active or inactive')
      .optional()
      .isIn(['active', 'inactive'])
  ],
  updateCategory
);

// @route   DELETE /api/categories/:id
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;

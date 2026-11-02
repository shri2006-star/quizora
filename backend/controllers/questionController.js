const { validationResult } = require('express-validator');
const Question = require('../models/Question');
const Category = require('../models/Category');

/**
 * @desc    Get all questions with filtering and pagination (Admin)
 * @route   GET /api/questions
 * @access  Private/Admin
 */
const getQuestions = async (req, res, next) => {
  try {
    const { category, difficulty, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) {
      query.categoryId = category;
    }

    if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      query.difficulty = difficulty;
    }

    if (search) {
      query.questionText = { $regex: search, $options: 'i' };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [questions, total] = await Promise.all([
      Question.find(query)
        .populate('categoryId', 'name difficulty')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Question.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        questions,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum) || 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single question by ID
 * @route   GET /api/questions/:id
 * @access  Private/Admin
 */
const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate('categoryId', 'name difficulty');
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new question
 * @route   POST /api/questions
 * @access  Private/Admin
 */
const createQuestion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { categoryId, questionText, options, correctAnswer, explanation, difficulty } = req.body;

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Selected category does not exist'
      });
    }

    // Validate options count and format
    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({
        success: false,
        message: 'Questions must provide exactly 4 options'
      });
    }

    // Validate correctAnswer index
    const parsedCorrectAnswer = Number(correctAnswer);
    if (isNaN(parsedCorrectAnswer) || parsedCorrectAnswer < 0 || parsedCorrectAnswer > 3) {
      return res.status(400).json({
        success: false,
        message: 'Correct answer index must be an integer between 0 and 3'
      });
    }

    const formattedOptions = options.map(opt => ({
      text: typeof opt === 'string' ? opt.trim() : (opt.text ? opt.text.trim() : '')
    }));

    if (formattedOptions.some(opt => !opt.text)) {
      return res.status(400).json({
        success: false,
        message: 'All 4 options must contain non-empty text'
      });
    }

    const question = await Question.create({
      categoryId,
      questionText: questionText.trim(),
      options: formattedOptions,
      correctAnswer: parsedCorrectAnswer,
      explanation: explanation ? explanation.trim() : '',
      difficulty: difficulty || category.difficulty || 'Medium'
    });

    // Update category questionCount
    await Category.findByIdAndUpdate(categoryId, { $inc: { questionCount: 1 } });

    const populatedQuestion = await Question.findById(question._id).populate('categoryId', 'name difficulty');

    return res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: populatedQuestion
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a question
 * @route   PUT /api/questions/:id
 * @access  Private/Admin
 */
const updateQuestion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const { categoryId, questionText, options, correctAnswer, explanation, difficulty } = req.body;
    const oldCategoryId = question.categoryId.toString();

    // Check category change
    if (categoryId && categoryId.toString() !== oldCategoryId) {
      const targetCategory = await Category.findById(categoryId);
      if (!targetCategory) {
        return res.status(404).json({
          success: false,
          message: 'Target category does not exist'
        });
      }
      question.categoryId = categoryId;
      // Decrement old category and increment new category count
      await Category.findByIdAndUpdate(oldCategoryId, { $inc: { questionCount: -1 } });
      await Category.findByIdAndUpdate(categoryId, { $inc: { questionCount: 1 } });
    }

    if (questionText) {
      question.questionText = questionText.trim();
    }

    if (options !== undefined) {
      if (!Array.isArray(options) || options.length !== 4) {
        return res.status(400).json({
          success: false,
          message: 'Question must have exactly 4 options'
        });
      }
      const formattedOptions = options.map(opt => ({
        text: typeof opt === 'string' ? opt.trim() : (opt.text ? opt.text.trim() : '')
      }));
      if (formattedOptions.some(opt => !opt.text)) {
        return res.status(400).json({
          success: false,
          message: 'All 4 options must contain non-empty text'
        });
      }
      question.options = formattedOptions;
    }

    if (correctAnswer !== undefined) {
      const parsedCorrectAnswer = Number(correctAnswer);
      if (isNaN(parsedCorrectAnswer) || parsedCorrectAnswer < 0 || parsedCorrectAnswer > 3) {
        return res.status(400).json({
          success: false,
          message: 'Correct answer index must be an integer between 0 and 3'
        });
      }
      question.correctAnswer = parsedCorrectAnswer;
    }

    if (explanation !== undefined) {
      question.explanation = explanation.trim();
    }

    if (difficulty !== undefined) {
      question.difficulty = difficulty;
    }

    await question.save();

    const updatedQuestion = await Question.findById(question._id).populate('categoryId', 'name difficulty');

    return res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: updatedQuestion
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a question
 * @route   DELETE /api/questions/:id
 * @access  Private/Admin
 */
const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const categoryId = question.categoryId;
    await Question.findByIdAndDelete(req.params.id);

    // Decrement category question count (prevent negative)
    await Category.findByIdAndUpdate(categoryId, {
      $inc: { questionCount: -1 }
    });

    return res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
};

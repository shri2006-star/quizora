const { validationResult } = require('express-validator');
const Question = require('../models/Question');
const Category = require('../models/Category');
const Result = require('../models/Result');

/**
 * Fisher-Yates array shuffle helper
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * @desc    Start a quiz for a category (returns questions without answers)
 * @route   POST /api/quiz/start
 * @access  Private
 */
const startQuiz = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { categoryId } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Quiz category not found'
      });
    }

    if (category.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This quiz category is currently inactive'
      });
    }

    // Fetch questions without correctAnswer and explanation
    const questions = await Question.find({ categoryId })
      .select('-correctAnswer -explanation')
      .lean();

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions found for this category'
      });
    }

    // Shuffle question order
    const shuffledQuestions = shuffleArray(questions);

    return res.status(200).json({
      success: true,
      data: {
        categoryId: category._id,
        categoryName: category.name,
        difficulty: category.difficulty,
        totalQuestions: shuffledQuestions.length,
        timeLimit: 600, // 600 seconds (10 minutes)
        questions: shuffledQuestions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit quiz answers and calculate results server-side
 * @route   POST /api/quiz/submit
 * @access  Private
 */
const submitQuiz = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { categoryId, answers = [], timeTaken = 0 } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Quiz category not found'
      });
    }

    // Fetch all questions for this category with correct answers and explanations
    const allQuestions = await Question.find({ categoryId }).lean();
    if (!allQuestions || allQuestions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No questions found for this category to grade against'
      });
    }

    const questionMap = new Map();
    allQuestions.forEach(q => {
      questionMap.set(q._id.toString(), q);
    });

    // Create a map for submitted answers
    const submittedAnswersMap = new Map();
    answers.forEach(item => {
      if (item && item.questionId) {
        submittedAnswersMap.set(item.questionId.toString(), Number(item.selectedAnswer));
      }
    });

    let score = 0;
    const gradedAnswers = [];
    const detailedFeedback = [];

    // Evaluate all category questions
    allQuestions.forEach(q => {
      const qId = q._id.toString();
      const selectedAnswer = submittedAnswersMap.has(qId)
        ? submittedAnswersMap.get(qId)
        : -1; // -1 represents unanswered/skipped

      const isCorrect = selectedAnswer === q.correctAnswer;
      if (isCorrect) {
        score++;
      }

      gradedAnswers.push({
        questionId: q._id,
        selectedAnswer,
        isCorrect
      });

      detailedFeedback.push({
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        selectedAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation || ''
      });
    });

    const totalQuestions = allQuestions.length;
    const percentage = totalQuestions > 0
      ? Math.round((score / totalQuestions) * 100 * 100) / 100
      : 0;

    const result = await Result.create({
      userId: req.user._id,
      categoryId,
      score,
      totalQuestions,
      percentage,
      answers: gradedAnswers,
      timeTaken: Math.max(0, parseInt(timeTaken, 10) || 0),
      submittedAt: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        resultId: result._id,
        categoryId: category._id,
        categoryName: category.name,
        difficulty: category.difficulty,
        score,
        totalQuestions,
        percentage,
        timeTaken: result.timeTaken,
        submittedAt: result.submittedAt,
        answers: detailedFeedback
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startQuiz,
  submitQuiz
};

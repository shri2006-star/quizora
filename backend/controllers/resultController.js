const mongoose = require('mongoose');
const Result = require('../models/Result');
const User = require('../models/User');
const Category = require('../models/Category');
const Question = require('../models/Question');

/**
 * @desc    Get user's personal quiz results
 * @route   GET /api/results/my
 * @access  Private
 */
const getMyResults = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10, sort = '-submittedAt' } = req.query;
    const query = { userId: req.user._id };

    if (category) {
      query.categoryId = category;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [results, total] = await Promise.all([
      Result.find(query)
        .populate('categoryId', 'name difficulty')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Result.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        results,
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
 * @desc    Get single quiz result by ID
 * @route   GET /api/results/:id
 * @access  Private
 */
const getResultById = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('categoryId', 'name difficulty description')
      .populate('userId', 'name email')
      .populate({
        path: 'answers.questionId',
        select: 'questionText options correctAnswer explanation difficulty'
      });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Quiz result not found'
      });
    }

    // Verify ownership or admin privileges
    const isOwner = result.userId && result.userId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this result'
      });
    }

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all results across platform (Admin only)
 * @route   GET /api/results
 * @access  Private/Admin
 */
const getAllResults = async (req, res, next) => {
  try {
    const {
      user,
      category,
      minScore,
      maxScore,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (user) {
      query.userId = user;
    }

    if (category) {
      query.categoryId = category;
    }

    if (minScore !== undefined || maxScore !== undefined) {
      query.percentage = {};
      if (minScore !== undefined) query.percentage.$gte = Number(minScore);
      if (maxScore !== undefined) query.percentage.$lte = Number(maxScore);
    }

    if (startDate || endDate) {
      query.submittedAt = {};
      if (startDate) query.submittedAt.$gte = new Date(startDate);
      if (endDate) query.submittedAt.$lte = new Date(endDate);
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [results, total] = await Promise.all([
      Result.find(query)
        .populate('userId', 'name email')
        .populate('categoryId', 'name difficulty')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Result.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        results,
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
 * @desc    Get dashboard statistics for the logged in user
 * @route   GET /api/stats/dashboard
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalAttempts = await Result.countDocuments({ userId });

    let averageScore = 0;
    let bestScore = 0;

    if (totalAttempts > 0) {
      const aggregateStats = await Result.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            avgScore: { $avg: '$percentage' },
            maxScore: { $max: '$percentage' }
          }
        }
      ]);

      if (aggregateStats.length > 0) {
        averageScore = Math.round(aggregateStats[0].avgScore * 100) / 100;
        bestScore = Math.round(aggregateStats[0].maxScore * 100) / 100;
      }
    }

    // 5 most recent results
    const recentResults = await Result.find({ userId })
      .populate('categoryId', 'name difficulty')
      .sort({ submittedAt: -1 })
      .limit(5)
      .lean();

    // Category breakdown
    const categoryBreakdown = await Result.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$categoryId',
          attempts: { $sum: 1 },
          averageScore: { $avg: '$percentage' },
          bestScore: { $max: '$percentage' },
          lastAttempt: { $max: '$submittedAt' }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryName: '$category.name',
          difficulty: '$category.difficulty',
          attempts: 1,
          averageScore: { $round: ['$averageScore', 2] },
          bestScore: { $round: ['$bestScore', 2] },
          lastAttempt: 1
        }
      },
      { $sort: { attempts: -1 } }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalAttempts,
        averageScore,
        bestScore,
        recentResults,
        categoryBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get platform-wide admin statistics
 * @route   GET /api/stats/admin
 * @access  Private/Admin
 */
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCategories,
      totalQuestions,
      totalAttempts,
      recentAttempts,
      overallAggregate
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Category.countDocuments(),
      Question.countDocuments(),
      Result.countDocuments(),
      Result.find()
        .populate('userId', 'name email')
        .populate('categoryId', 'name difficulty')
        .sort({ submittedAt: -1 })
        .limit(10)
        .lean(),
      Result.aggregate([
        {
          $group: {
            _id: null,
            avgScore: { $avg: '$percentage' }
          }
        }
      ])
    ]);

    const averageScore = overallAggregate.length > 0
      ? Math.round(overallAggregate[0].avgScore * 100) / 100
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCategories,
        totalQuestions,
        totalAttempts,
        averageScore,
        recentAttempts
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get leaderboard rankings
 * @route   GET /api/leaderboard
 * @access  Public
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const { category } = req.query;
    const matchStage = {};

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      matchStage.categoryId = new mongoose.Types.ObjectId(category);
    }

    const leaderboardAgg = await Result.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' },
          totalQuestionsAnswered: { $sum: '$totalQuestions' },
          averageScore: { $avg: '$percentage' },
          highestScore: { $max: '$percentage' },
          quizzesCompleted: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          email: '$user.email',
          totalScore: 1,
          totalQuestionsAnswered: 1,
          averageScore: { $round: ['$averageScore', 2] },
          highestScore: { $round: ['$highestScore', 2] },
          quizzesCompleted: 1
        }
      },
      {
        $sort: {
          averageScore: -1,
          quizzesCompleted: -1,
          totalScore: -1
        }
      },
      { $limit: 50 }
    ]);

    // Attach ranks
    const rankedLeaderboard = leaderboardAgg.map((entry, index) => ({
      rank: index + 1,
      ...entry
    }));

    return res.status(200).json({
      success: true,
      count: rankedLeaderboard.length,
      data: rankedLeaderboard
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyResults,
  getResultById,
  getAllResults,
  getDashboardStats,
  getAdminStats,
  getLeaderboard
};

const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category ID is required'],
    index: true
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: [true, 'Total questions count is required'],
    min: 1
  },
  percentage: {
    type: Number,
    required: [true, 'Percentage is required'],
    min: 0,
    max: 100
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: [true, 'Question ID is required']
      },
      selectedAnswer: {
        type: Number,
        required: [true, 'Selected answer index is required']
      },
      isCorrect: {
        type: Boolean,
        required: [true, 'isCorrect flag is required']
      }
    }
  ],
  timeTaken: {
    type: Number,
    default: 0 // In seconds
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

resultSchema.index({ userId: 1, categoryId: 1 });
resultSchema.index({ categoryId: 1, percentage: -1 });

module.exports = mongoose.model('Result', resultSchema);

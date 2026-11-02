const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: {
      values: ['Easy', 'Medium', 'Hard'],
      message: '{VALUE} is not a valid difficulty level'
    },
    default: 'Medium'
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive'],
      message: '{VALUE} is not a valid status'
    },
    default: 'active'
  },
  questionCount: {
    type: Number,
    default: 0,
    min: [0, 'Question count cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

categorySchema.index({ status: 1 });
categorySchema.index({ difficulty: 1 });

module.exports = mongoose.model('Category', categorySchema);

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
    index: true
  },
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [
      {
        text: {
          type: String,
          required: [true, 'Option text is required'],
          trim: true
        }
      }
    ],
    validate: {
      validator: function(val) {
        return Array.isArray(val) && val.length === 4;
      },
      message: 'Question must have exactly 4 options'
    }
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: [0, 'Correct answer index must be between 0 and 3'],
    max: [3, 'Correct answer index must be between 0 and 3']
  },
  explanation: {
    type: String,
    trim: true,
    default: ''
  },
  difficulty: {
    type: String,
    enum: {
      values: ['Easy', 'Medium', 'Hard'],
      message: '{VALUE} is not a valid difficulty level'
    },
    default: 'Medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

questionSchema.index({ categoryId: 1, difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);

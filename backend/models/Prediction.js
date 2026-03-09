// =============================================
// models/Prediction.js - Prediction Schema
// =============================================

const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  category: {
    type: String,
    enum: ['Gaming', 'Tech', 'Sports', 'Entertainment', 'Politics', 'Science', 'Other'],
    default: 'Other',
  },
  // Reference to the User who created this prediction
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',          // Links to the User model
    required: true,
  },
  yesVotes: {
    type: Number,
    default: 0,
  },
  noVotes: {
    type: Number,
    default: 0,
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ---- VIRTUAL FIELD ----
// Virtual fields are computed values not stored in DB
// This calculates total votes on the fly
PredictionSchema.virtual('totalVotes').get(function () {
  return this.yesVotes + this.noVotes;
});

// ---- VIRTUAL: YES PERCENTAGE ----
PredictionSchema.virtual('yesPercentage').get(function () {
  const total = this.yesVotes + this.noVotes;
  if (total === 0) return 50; // Default to 50/50 with no votes
  return Math.round((this.yesVotes / total) * 100);
});

// Include virtuals when converting to JSON
PredictionSchema.set('toJSON', { virtuals: true });
PredictionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Prediction', PredictionSchema);

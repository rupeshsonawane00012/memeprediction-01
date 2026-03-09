// =============================================
// models/Vote.js - Vote Schema
// =============================================
// Tracks who voted on what prediction.
// The unique compound index ensures one vote per user per prediction.

const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  // Which user cast this vote
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Which prediction was voted on
  predictionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prediction',
    required: true,
  },
  // The vote: 'yes' or 'no'
  voteType: {
    type: String,
    enum: ['yes', 'no'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ---- UNIQUE CONSTRAINT ----
// This ensures a user can only vote ONCE per prediction.
// MongoDB will throw an error if you try to insert a duplicate.
VoteSchema.index({ userId: 1, predictionId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);

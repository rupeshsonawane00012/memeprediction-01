// =============================================
// controllers/predictionController.js
// =============================================

const Prediction = require('../models/Prediction');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');

// ---- GET ALL PREDICTIONS ----
// GET /api/predictions
// Optional query params: ?category=Gaming&page=1
const getPredictions = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Count total for pagination
    const total = await Prediction.countDocuments(filter);

    // Fetch predictions with pagination
    // .populate() replaces the createdBy ID with the actual user data
    const predictions = await Prediction.find(filter)
      .populate('createdBy', 'username')  // Only get username from User
      .sort({ createdAt: -1 })             // Newest first
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // If user is logged in, also check which ones they've voted on
    let userVotes = {};
    if (req.user) {
      const votes = await Vote.find({
        userId: req.user._id,
        predictionId: { $in: predictions.map(p => p._id) },
      });
      votes.forEach(v => {
        userVotes[v.predictionId.toString()] = v.voteType;
      });
    }

    res.json({
      predictions,
      userVotes,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({ message: 'Error fetching predictions.' });
  }
};

// ---- GET SINGLE PREDICTION ----
// GET /api/predictions/:id
const getPrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id)
      .populate('createdBy', 'username');

    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found.' });
    }

    // Check if current user has voted
    let userVote = null;
    if (req.user) {
      const vote = await Vote.findOne({

        predictionId: prediction._id,
      });
      if (vote) userVote = vote.voteType;
    }

    res.json({ prediction, userVote });
  } catch (error) {
    console.error('Get prediction error:', error);
    res.status(500).json({ message: 'Error fetching prediction.' });
  }
};

// ---- CREATE PREDICTION ----
// POST /api/predictions  (requires auth)
const createPrediction = async (req, res) => {
  try {
    const { title, description, category, endDate } = req.body;

    if (!title || !endDate) {
      return res.status(400).json({
        message: "Title and end date are required"
      });
    }

    const prediction = await Prediction.create({
      title,
      description,
      category: category || "Other",
      endDate,
      yesVotes: 0,
      noVotes: 0
    });

    res.status(201).json({
      message: "Prediction created successfully",
      prediction
    });

  } catch (error) {
    console.error("Create prediction error:", error);
    res.status(500).json({
      message: "Error creating prediction"
    });
  }
};

// ---- VOTE ON PREDICTION ----
// POST /api/predictions/:id/vote  (requires auth)
const voteOnPrediction = async (req, res) => {
  try {
    const { voteType } = req.body; // 'yes' or 'no'

    if (!['yes', 'no'].includes(voteType)) {
      return res.status(400).json({ message: 'Vote must be "yes" or "no".' });
    }

    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found.' });
    }

    // Check if prediction has ended
    if (new Date(prediction.endDate) < new Date()) {
      return res.status(400).json({ message: 'This prediction has ended.' });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({
      userId: req.user._id,
      predictionId: prediction._id,
    });

    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted on this prediction.' });
    }

   res.status(201).json(prediction);

    // Update vote counts on the prediction
    if (voteType === 'yes') {
      prediction.yesVotes += 1;
    } else {
      prediction.noVotes += 1;
    }
    await prediction.save();

    res.json({
      message: `Voted ${voteType.toUpperCase()}!`,
      yesVotes: prediction.yesVotes,
      noVotes: prediction.noVotes,
      userVote: voteType,
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Error recording vote.' });
  }
};

module.exports = { getPredictions, getPrediction, createPrediction, voteOnPrediction };

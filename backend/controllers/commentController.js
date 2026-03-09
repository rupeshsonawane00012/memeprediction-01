const Comment = require("../models/Comment");
const Prediction = require("../models/Prediction");

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ predictionId: req.params.id })
      .populate("userId", "username")
      .sort({ createdAt: -1 });
    res.json({ comments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments." });
  }
};

const createComment = async (req, res) => {
  try {
    const { predictionId, text } = req.body;
    if (!predictionId || !text) return res.status(400).json({ message: "Prediction ID and text are required." });
    const prediction = await Prediction.findById(predictionId);
    if (!prediction) return res.status(404).json({ message: "Prediction not found." });
    const comment = await Comment.create({ userId: req.user._id, predictionId, text });
    await comment.populate("userId", "username");
    res.status(201).json({ message: "Comment added!", comment });
  } catch (error) {
    res.status(500).json({ message: "Error posting comment." });
  }
};

module.exports = { getComments, createComment };

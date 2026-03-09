const express = require("express");
const router = express.Router();

const {
  getPredictions,
  getPrediction,
  createPrediction,
  voteOnPrediction,
} = require("../controllers/predictionController");

const { getComments } = require("../controllers/commentController");

router.get("/", getPredictions);
router.get("/:id", getPrediction);
router.post("/", createPrediction);
router.post("/:id/vote", voteOnPrediction);
router.get("/:id/comments", getComments);

module.exports = router;
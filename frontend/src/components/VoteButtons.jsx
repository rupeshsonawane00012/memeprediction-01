import { useState } from "react";
import { predictionsAPI } from "../services/api";

const VoteButtons = ({ prediction, onVoteSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleVote = async (voteType) => {
    try {
      setLoading(true);

      const res = await predictionsAPI.vote(prediction._id, voteType);

      if (onVoteSuccess) {
        onVoteSuccess(res.data);
      }

    } catch (err) {
      console.error("Vote failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => handleVote("yes")}
        disabled={loading}
        className="bg-green-500 px-4 py-2 rounded"
      >
        YES
      </button>

      <button
        onClick={() => handleVote("no")}
        disabled={loading}
        className="bg-red-500 px-4 py-2 rounded"
      >
        NO
      </button>
    </div>
  );
};

export default VoteButtons;
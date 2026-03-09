// =============================================
// src/pages/PredictionDetail.jsx
// =============================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { predictionsAPI } from '../services/api';
import VoteButtons from '../components/VoteButtons';
import CommentSection from '../components/CommentSection';

const categoryColors = {
  Gaming: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  Tech: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
  Sports: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  Entertainment: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
  Politics: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  Science: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  Other: 'text-slate-400 border-slate-400/30 bg-slate-400/10',
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

const PredictionDetail = () => {
  const { id } = useParams(); // Get the :id from the URL
  const [prediction, setPrediction] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await predictionsAPI.getById(id);
        setPrediction(res.data.prediction);
        setUserVote(res.data.userVote);
      } catch (err) {
        setError(err.response?.data?.message || 'Prediction not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="text-violet-400 font-mono animate-pulse">Loading prediction...</div>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-red-400 font-mono mb-4">{error || 'Prediction not found.'}</p>
        <Link to="/" className="text-violet-400 hover:underline text-sm">← Back to Predictions</Link>
      </div>
    );
  }

  const ended = new Date(prediction.endDate) < new Date();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">

      {/* Breadcrumb */}
      <Link to="/" className="text-slate-500 hover:text-slate-300 text-sm font-mono mb-6 inline-block transition-colors">
        ← Back to Predictions
      </Link>

      {/* ---- PREDICTION HEADER ---- */}
      <div className="card p-6 mb-6">
        {/* Category + Status */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`badge ${categoryColors[prediction.category] || categoryColors.Other}`}>
            {prediction.category}
          </span>
          <span className={`text-xs font-mono ${ended ? 'text-red-400' : 'text-[#00ff88]'}`}>
            {ended ? '● ENDED' : '● LIVE'}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-display text-white tracking-wide leading-tight mb-4">
          {prediction.title}
        </h1>

        {/* Description */}
        {prediction.description && (
          <p className="text-slate-400 text-base leading-relaxed mb-4">
            {prediction.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-mono pt-4 border-t border-[#1e1e2e]">
          <span>By <span className="text-violet-400">{prediction.createdBy?.username}</span></span>
          <span>Created {formatDate(prediction.createdAt)}</span>
          <span className={ended ? 'text-red-400/70' : ''}>
            {ended ? 'Ended' : 'Ends'} {formatDate(prediction.endDate)}
          </span>
        </div>
      </div>

      {/* ---- VOTING SECTION ---- */}
      <div className="card p-6 mb-6">
        <h2 className="font-display text-xl text-slate-300 tracking-wide mb-4">CAST YOUR VOTE</h2>
        <VoteButtons
          prediction={prediction}
          userVote={userVote}
          onVoteSuccess={(data) => {
            setPrediction(prev => ({
              ...prev,
              yesVotes: data.yesVotes,
              noVotes: data.noVotes,
            }));
            setUserVote(data.userVote);
          }}
        />
      </div>

      {/* ---- COMMENTS SECTION ---- */}
      <div className="card p-6">
        <CommentSection predictionId={id} />
      </div>
    </div>
  );
};

export default PredictionDetail;

// =============================================
// src/pages/Home.jsx - Homepage
// =============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { predictionsAPI } from '../services/api';
import PredictionCard from '../components/PredictionCard';

const CATEGORIES = ['All', 'Gaming', 'Tech', 'Sports', 'Entertainment', 'Politics', 'Science', 'Other'];

const Home = () => {
  const [predictions, setPredictions] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch predictions whenever category or page changes
  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await predictionsAPI.getAll({ category, page, limit: 9 });
        setPredictions(res.data.predictions);
        setUserVotes(res.data.userVotes || {});
        setTotalPages(res.data.pages);
      } catch (err) {
        setError('Failed to load predictions. Is the backend running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [category, page]);

  // Reset to page 1 when category changes
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ---- HERO SECTION ---- */}
      <div className="text-center mb-12 py-8">
        <div className="inline-block mb-4">
          <span className="font-mono text-xs text-violet-400 border border-violet-400/30 bg-violet-400/10 px-3 py-1 rounded-full">
            🔮 PREDICT THE FUTURE
          </span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-display text-white tracking-widest mb-4">
          VOTE ON <span className="text-[#00ff88] text-glow-green">MEME</span> PREDICTIONS
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-6">
          The internet's favorite predictions. No money. Just vibes. Vote YES or NO on what you think will happen.
        </p>
        <Link to="/create" className="btn-primary inline-block px-6 py-3 text-base">
          + Create a Prediction
        </Link>
      </div>

      {/* ---- CATEGORY FILTER ---- */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-mono border transition-all duration-200 ${
              category === cat
                ? 'bg-violet-700 border-violet-500 text-white'
                : 'border-[#1e1e2e] text-slate-400 hover:border-violet-500/50 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ---- PREDICTIONS GRID ---- */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-3 bg-[#1e1e2e] rounded mb-4 w-1/3" />
              <div className="h-5 bg-[#1e1e2e] rounded mb-2" />
              <div className="h-5 bg-[#1e1e2e] rounded mb-6 w-2/3" />
              <div className="h-2 bg-[#1e1e2e] rounded mb-4" />
              <div className="h-3 bg-[#1e1e2e] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-400 font-mono text-sm mb-2">{error}</p>
          <p className="text-slate-500 text-xs">Make sure the backend server is running on port 5000.</p>
        </div>
      ) : predictions.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-4">🤔</p>
          <p className="text-lg font-display tracking-wide">NO PREDICTIONS YET</p>
          <p className="text-sm mt-2">Be the first to create one!</p>
          <Link to="/create" className="btn-primary inline-block mt-4 px-5 py-2 text-sm">
            Create Prediction
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predictions.map((prediction) => (
            <PredictionCard
              key={prediction._id}
              prediction={prediction}
              userVote={userVotes[prediction._id]}
            />
          ))}
        </div>
      )}

      {/* ---- PAGINATION ---- */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-10">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn border border-[#1e1e2e] text-slate-400 hover:text-white disabled:opacity-30"
          >
            ← Prev
          </button>
          <span className="flex items-center text-slate-400 font-mono text-sm">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn border border-[#1e1e2e] text-slate-400 hover:text-white disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { predictionsAPI } from "../services/api";
import PredictionCard from "../components/PredictionCard";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [preds, setPreds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    predictionsAPI.getAll({ limit: 100 }).then(r => {
      setPreds(r.data.predictions.filter(p => p.createdBy?._id === user._id || p.createdBy === user._id));
    }).catch(console.error).finally(() => setLoading(false));
  }, [user._id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="card p-8 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center text-3xl font-display text-white">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-display text-white tracking-wider">{user?.username}</h1>
              <p className="text-slate-500 text-sm font-mono mt-1">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} className="btn border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm">Logout</button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#1e1e2e]">
          <div className="text-center"><p className="text-3xl font-display text-[#00ff88]">{preds.length}</p><p className="text-xs text-slate-500 font-mono mt-1">Predictions Created</p></div>
          <div className="text-center"><p className="text-3xl font-display text-violet-400">{preds.reduce((s,p) => s + p.yesVotes + p.noVotes, 0)}</p><p className="text-xs text-slate-500 font-mono mt-1">Total Votes Received</p></div>
          <div className="text-center"><p className="text-3xl font-display text-[#ff3366]">{preds.filter(p => new Date(p.endDate) < new Date()).length}</p><p className="text-xs text-slate-500 font-mono mt-1">Ended</p></div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-display text-white tracking-wide">MY PREDICTIONS</h2>
          <Link to="/create" className="btn-primary text-sm px-4 py-2">+ New</Link>
        </div>
        {loading ? <div className="text-slate-500 font-mono animate-pulse py-8 text-center">Loading...</div>
          : preds.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-slate-400 font-display text-xl tracking-wide mb-4">NO PREDICTIONS YET</p>
              <Link to="/create" className="btn-primary inline-block px-5 py-2 text-sm">Create Your First</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preds.map(p => <PredictionCard key={p._id} prediction={p} />)}
            </div>
          )}
      </div>
    </div>
  );
};
export default Profile;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { predictionsAPI, commentsAPI } from "../services/api";

const formatTime = (d) => {
  const diff = Date.now() - new Date(d);
  const m = Math.floor(diff/60000), h = Math.floor(diff/3600000), day = Math.floor(diff/86400000);
  if (m < 1) return "just now"; if (m < 60) return `${m}m ago`; if (h < 24) return `${h}h ago`; return `${day}d ago`;
};

const CommentSection = ({ predictionId }) => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    predictionsAPI.getComments(predictionId).then(r => setComments(r.data.comments)).catch(console.error).finally(() => setLoading(false));
  }, [predictionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!isLoggedIn) { navigate("/login"); return; }
    setPosting(true); setError("");
    try {
      const r = await commentsAPI.create({ predictionId, text: text.trim() });
      setComments([r.data.comment, ...comments]); setText("");
    } catch (err) { setError(err.response?.data?.message || "Error posting."); }
    finally { setPosting(false); }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display text-xl text-slate-300 tracking-wide">COMMENTS <span className="text-slate-500 text-base">({comments.length})</span></h3>
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-1">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Share your hot take..." rows={2} maxLength={500} className="input resize-none flex-1" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-mono">{text.length}/500</span>
            <button type="submit" disabled={posting || !text.trim()} className="btn-primary text-sm px-4 py-2 disabled:opacity-40">
              {posting ? "Posting..." : "Post Comment"}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
        </form>
      ) : (
        <div className="card p-4 text-center text-slate-500 text-sm">
          <button onClick={() => navigate("/login")} className="text-violet-400 hover:underline">Login</button> to join the discussion
        </div>
      )}
      {loading ? <div className="text-slate-500 text-sm font-mono animate-pulse py-4">Loading comments...</div>
        : comments.length === 0 ? <div className="card p-6 text-center text-slate-500 text-sm">No comments yet. Be the first! 🔥</div>
        : (
          <div className="space-y-3">
            {comments.map(c => (
              <div key={c._id} className="card p-4 flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-violet-800 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {c.userId?.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-300">{c.userId?.username}</span>
                    <span className="text-xs text-slate-500 font-mono">{formatTime(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed break-words">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};
export default CommentSection;

# =============================================
# MemePredict - Create Missing Files Script
# =============================================
# Run this from: C:\Users\Asus\Downloads\files
# Command: .\setup.ps1

Write-Host "Creating missing MemePredict files..." -ForegroundColor Cyan

# ---- BACKEND: package.json ----
Set-Content -Path "backend\package.json" -Value '{
  "name": "memepredict-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}'
Write-Host "  [OK] backend/package.json" -ForegroundColor Green

# ---- BACKEND: .env.example ----
Set-Content -Path "backend\.env.example" -Value 'MONGO_URI=mongodb://localhost:27017/memepredict
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
FRONTEND_URL=http://localhost:5173'
Write-Host "  [OK] backend/.env.example" -ForegroundColor Green

# ---- BACKEND: models/Comment.js ----
Set-Content -Path "backend\models\Comment.js" -Value 'const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  predictionId: { type: mongoose.Schema.Types.ObjectId, ref: "Prediction", required: true },
  text: { type: String, required: true, trim: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);'
Write-Host "  [OK] backend/models/Comment.js" -ForegroundColor Green

# ---- BACKEND: controllers/commentController.js ----
Set-Content -Path "backend\controllers\commentController.js" -Value 'const Comment = require("../models/Comment");
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

module.exports = { getComments, createComment };'
Write-Host "  [OK] backend/controllers/commentController.js" -ForegroundColor Green

# ---- BACKEND: routes/auth.js ----
Set-Content -Path "backend\routes\auth.js" -Value 'const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;'
Write-Host "  [OK] backend/routes/auth.js" -ForegroundColor Green

# ---- BACKEND: routes/comments.js ----
Set-Content -Path "backend\routes\comments.js" -Value 'const express = require("express");
const router = express.Router();
const { createComment } = require("../controllers/commentController");
const { protect } = require("../middleware/auth");

router.post("/", protect, createComment);

module.exports = router;'
Write-Host "  [OK] backend/routes/comments.js" -ForegroundColor Green

# ---- BACKEND: routes/predictions.js ----
Set-Content -Path "backend\routes\predictions.js" -Value 'const express = require("express");
const router = express.Router();
const { getPredictions, getPrediction, createPrediction, voteOnPrediction } = require("../controllers/predictionController");
const { getComments } = require("../controllers/commentController");
const { protect } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (e) {}
  }
  next();
};

router.get("/", optionalAuth, getPredictions);
router.get("/:id", optionalAuth, getPrediction);
router.post("/", protect, createPrediction);
router.post("/:id/vote", protect, voteOnPrediction);
router.get("/:id/comments", getComments);

module.exports = router;'
Write-Host "  [OK] backend/routes/predictions.js" -ForegroundColor Green

# ---- BACKEND: seed.js ----
Set-Content -Path "backend\seed.js" -Value 'const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const User = require("./models/User");
const Prediction = require("./models/Prediction");

const predictions = [
  { title: "Will GTA 6 release in 2026?", description: "Rockstar has been teasing for years...", category: "Gaming", yesVotes: 342, noVotes: 158, endDate: new Date("2026-12-31") },
  { title: "Will AI replace programmers by 2030?", description: "With Copilot and ChatGPT taking over...", category: "Tech", yesVotes: 210, noVotes: 445, endDate: new Date("2030-01-01") },
  { title: "Will India win the next Cricket World Cup?", description: "India has been on fire lately!", category: "Sports", yesVotes: 556, noVotes: 234, endDate: new Date("2027-06-30") },
  { title: "Will the next iPhone have a foldable screen?", description: "Samsung did it. Is Apple next?", category: "Tech", yesVotes: 189, noVotes: 310, endDate: new Date("2026-09-30") },
  { title: "Will we find alien life before 2030?", description: "James Webb is watching...", category: "Science", yesVotes: 123, noVotes: 677, endDate: new Date("2030-01-01") },
  { title: "Will Elon Musk go to Mars this decade?", description: "Starship is almost ready...", category: "Science", yesVotes: 201, noVotes: 399, endDate: new Date("2030-12-31") },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/memepredict");
    console.log("Connected to MongoDB");
    let demoUser = await User.findOne({ email: "demo@memepredict.com" });
    if (!demoUser) {
      demoUser = await User.create({ username: "MemeOracle", email: "demo@memepredict.com", password: "password123" });
      console.log("Created demo user: demo@memepredict.com / password123");
    }
    for (const p of predictions) {
      const exists = await Prediction.findOne({ title: p.title });
      if (!exists) await Prediction.create({ ...p, createdBy: demoUser._id });
    }
    console.log("Seeded! Run the app and go to http://localhost:5173");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
seed();'
Write-Host "  [OK] backend/seed.js" -ForegroundColor Green

# ---- FRONTEND: package.json ----
Set-Content -Path "frontend\package.json" -Value '{
  "name": "memepredict-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.8"
  }
}'
Write-Host "  [OK] frontend/package.json" -ForegroundColor Green

# ---- FRONTEND: index.html ----
Set-Content -Path "frontend\index.html" -Value '<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MemePredict</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>'
Write-Host "  [OK] frontend/index.html" -ForegroundColor Green

# ---- FRONTEND: vite.config.js ----
Set-Content -Path "frontend\vite.config.js" -Value 'import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
})'
Write-Host "  [OK] frontend/vite.config.js" -ForegroundColor Green

# ---- FRONTEND: tailwind.config.js ----
Set-Content -Path "frontend\tailwind.config.js" -Value '/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}'
Write-Host "  [OK] frontend/tailwind.config.js" -ForegroundColor Green

# ---- FRONTEND: postcss.config.js ----
Set-Content -Path "frontend\postcss.config.js" -Value 'export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}'
Write-Host "  [OK] frontend/postcss.config.js" -ForegroundColor Green

# ---- FRONTEND: src/main.jsx ----
Set-Content -Path "frontend\src\main.jsx" -Value 'import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)'
Write-Host "  [OK] frontend/src/main.jsx" -ForegroundColor Green

# ---- FRONTEND: src/index.css ----
Set-Content -Path "frontend\src\index.css" -Value '@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { background-color: #0a0a0f; color: #e2e8f0; font-family: "DM Sans", sans-serif; }
  h1, h2, h3 { font-family: "Bebas Neue", cursive; letter-spacing: 0.05em; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #12121a; }
  ::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 3px; }
}

@layer components {
  .card { @apply bg-[#12121a] border border-[#1e1e2e] rounded-xl; }
  .btn { @apply px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer; }
  .btn-yes { @apply btn bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 hover:bg-[#00ff88]/20 hover:border-[#00ff88]/60; }
  .btn-no  { @apply btn bg-[#ff3366]/10 text-[#ff3366] border border-[#ff3366]/30 hover:bg-[#ff3366]/20 hover:border-[#ff3366]/60; }
  .btn-primary { @apply btn bg-violet-700 text-white hover:bg-violet-600; }
  .input { @apply w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors duration-200; }
  .badge { @apply text-xs font-mono px-2 py-0.5 rounded-full border; }
}

@layer utilities {
  @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fade-in  { from { opacity: 0; } to { opacity: 1; } }
  .animate-slide-up { animation: slide-up 0.4s ease-out; }
  .animate-fade-in  { animation: fade-in 0.3s ease-out; }
}'
Write-Host "  [OK] frontend/src/index.css" -ForegroundColor Green

# ---- FRONTEND: src/components/Navbar.jsx ----
Set-Content -Path "frontend\src\components\Navbar.jsx" -Value 'import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1e1e2e] bg-[#0a0a0f]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="group">
          <span className="text-3xl font-display tracking-widest text-white group-hover:text-violet-400 transition-colors">
            MEME<span className="text-[#00ff88]">PREDICT</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors">Predictions</Link>
          {isLoggedIn ? (
            <>
              <Link to="/create" className="btn-primary text-sm px-4 py-2 rounded-lg">+ Create</Link>
              <Link to="/profile" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
                <div className="w-7 h-7 rounded-full bg-violet-700 flex items-center justify-center text-xs font-bold text-white">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                {user?.username}
              </Link>
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-400 hover:text-white text-sm">Login</Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2 rounded-lg">Get Started</Link>
            </>
          )}
        </div>
        <button className="md:hidden text-slate-400" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-[#1e1e2e] px-4 py-4 flex flex-col gap-3 bg-[#0a0a0f]">
          <Link to="/" onClick={() => setOpen(false)} className="text-slate-400 py-2">Predictions</Link>
          {isLoggedIn ? (
            <>
              <Link to="/create" onClick={() => setOpen(false)} className="text-[#00ff88] py-2">+ Create</Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="text-slate-400 py-2">Profile</Link>
              <button onClick={handleLogout} className="text-left text-red-400 py-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="text-slate-400 py-2">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="text-violet-400 py-2">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
export default Navbar;'
Write-Host "  [OK] frontend/src/components/Navbar.jsx" -ForegroundColor Green

# ---- FRONTEND: src/components/PredictionCard.jsx ----
Set-Content -Path "frontend\src\components\PredictionCard.jsx" -Value 'import { Link } from "react-router-dom";

const categoryColors = {
  Gaming: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  Tech: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
  Sports: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  Entertainment: "text-pink-400 border-pink-400/30 bg-pink-400/10",
  Politics: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  Science: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  Other: "text-slate-400 border-slate-400/30 bg-slate-400/10",
};

const PredictionCard = ({ prediction, userVote }) => {
  const total = prediction.yesVotes + prediction.noVotes;
  const yesPercent = total === 0 ? 50 : Math.round((prediction.yesVotes / total) * 100);
  const noPercent = 100 - yesPercent;
  const ended = new Date(prediction.endDate) < new Date();

  return (
    <Link to={`/prediction/${prediction._id}`}
      className="card block p-5 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-0.5 group animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <span className={`badge ${categoryColors[prediction.category] || categoryColors.Other}`}>{prediction.category}</span>
        <span className={`text-xs font-mono ${ended ? "text-red-400" : "text-[#00ff88]"}`}>{ended ? "● ENDED" : "● LIVE"}</span>
      </div>
      <h3 className="text-white font-semibold text-base mb-4 group-hover:text-violet-300 transition-colors leading-snug">{prediction.title}</h3>
      <div className="mb-3">
        <div className="flex rounded-full overflow-hidden h-2.5 mb-2">
          <div className="bg-[#00ff88] transition-all duration-700" style={{ width: `${yesPercent}%` }} />
          <div className="bg-[#ff3366] transition-all duration-700" style={{ width: `${noPercent}%` }} />
        </div>
        <div className="flex justify-between text-xs font-mono">
          <span className="text-[#00ff88]">YES {yesPercent}%</span>
          <span className="text-[#ff3366]">NO {noPercent}%</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-3 border-t border-[#1e1e2e]">
        <div className="flex items-center gap-3">
          <span>{total.toLocaleString()} votes</span>
          {userVote && <span className={`font-mono ${userVote === "yes" ? "text-[#00ff88]" : "text-[#ff3366]"}`}>You: {userVote.toUpperCase()}</span>}
        </div>
        <span>Ends {new Date(prediction.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      </div>
    </Link>
  );
};
export default PredictionCard;'
Write-Host "  [OK] frontend/src/components/PredictionCard.jsx" -ForegroundColor Green

# ---- FRONTEND: src/components/CommentSection.jsx ----
Set-Content -Path "frontend\src\components\CommentSection.jsx" -Value 'import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { predictionsAPI, commentsAPI } from "../services/api";
import { useAuth } from "../utils/AuthContext";

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
export default CommentSection;'
Write-Host "  [OK] frontend/src/components/CommentSection.jsx" -ForegroundColor Green

# ---- FRONTEND: src/pages/Login.jsx ----
Set-Content -Path "frontend\src\pages\Login.jsx" -Value 'import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await login(form.email, form.password); navigate("/"); }
    catch (err) { setError(err.response?.data?.message || "Login failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display text-white tracking-widest mb-2">WELCOME BACK</h1>
          <p className="text-slate-500 text-sm">Login to vote and create predictions</p>
        </div>
        <div className="card p-8 space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm font-mono">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5 font-mono">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" required className="input" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5 font-mono">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required className="input" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-50">
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>
          <p className="text-center text-slate-500 text-sm pt-2">
            No account? <Link to="/register" className="text-violet-400 hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;'
Write-Host "  [OK] frontend/src/pages/Login.jsx" -ForegroundColor Green

# ---- FRONTEND: src/pages/Register.jsx ----
Set-Content -Path "frontend\src\pages\Register.jsx" -Value 'import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    try { await register(form.username, form.email, form.password); navigate("/"); }
    catch (err) { setError(err.response?.data?.message || "Registration failed."); }
    finally { setLoading(false); }
  };

  const f = (k) => ({ value: form[k], onChange: e => setForm({...form, [k]: e.target.value}) });

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display text-white tracking-widest mb-2">JOIN THE FUN</h1>
          <p className="text-slate-500 text-sm">Create an account to start predicting</p>
        </div>
        <div className="card p-8 space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm font-mono">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm text-slate-400 mb-1.5 font-mono">Username</label><input type="text" {...f("username")} placeholder="CoolPredictor42" required minLength={3} className="input" /></div>
            <div><label className="block text-sm text-slate-400 mb-1.5 font-mono">Email</label><input type="email" {...f("email")} placeholder="you@example.com" required className="input" /></div>
            <div><label className="block text-sm text-slate-400 mb-1.5 font-mono">Password</label><input type="password" {...f("password")} placeholder="At least 6 characters" required className="input" /></div>
            <div><label className="block text-sm text-slate-400 mb-1.5 font-mono">Confirm Password</label><input type="password" {...f("confirm")} placeholder="••••••••" required className="input" /></div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-50">
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>
          <p className="text-center text-slate-500 text-sm pt-2">
            Have an account? <Link to="/login" className="text-violet-400 hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;'
Write-Host "  [OK] frontend/src/pages/Register.jsx" -ForegroundColor Green

# ---- FRONTEND: src/pages/CreatePrediction.jsx ----
Set-Content -Path "frontend\src\pages\CreatePrediction.jsx" -Value 'import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictionsAPI } from "../services/api";

const CATEGORIES = ["Gaming", "Tech", "Sports", "Entertainment", "Politics", "Science", "Other"];
const getNextWeek = () => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split("T")[0]; };

const CreatePrediction = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", category: "Other", endDate: getNextWeek() });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try { const r = await predictionsAPI.create(form); navigate(`/prediction/${r.data.prediction._id}`); }
    catch (err) { setError(err.response?.data?.message || "Error creating prediction."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-slide-up">
      <div className="mb-8">
        <h1 className="text-5xl font-display text-white tracking-widest mb-2">CREATE PREDICTION</h1>
        <p className="text-slate-500 text-sm">Ask a yes/no question and let the internet decide.</p>
      </div>
      <div className="card p-8">
        {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm font-mono mb-6">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5 font-mono">Title <span className="text-red-400">*</span></label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Will GTA 6 release in 2026?" required maxLength={200} className="input" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5 font-mono">Description <span className="text-slate-600">(optional)</span></label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Add more context..." rows={3} maxLength={1000} className="input resize-none" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5 font-mono">Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5 font-mono">End Date <span className="text-red-400">*</span></label>
            <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} min={new Date().toISOString().split("T")[0]} required className="input" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate("/")} className="btn flex-1 border border-[#1e1e2e] text-slate-400 hover:text-white py-3">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-grow py-3 disabled:opacity-50">{loading ? "Publishing..." : "🔮 Publish Prediction"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreatePrediction;'
Write-Host "  [OK] frontend/src/pages/CreatePrediction.jsx" -ForegroundColor Green

# ---- FRONTEND: src/pages/Profile.jsx ----
Set-Content -Path "frontend\src\pages\Profile.jsx" -Value 'import { useState, useEffect } from "react";
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
export default Profile;'
Write-Host "  [OK] frontend/src/pages/Profile.jsx" -ForegroundColor Green

Write-Host ""
Write-Host "All files created!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. cd backend" -ForegroundColor White
Write-Host "  2. npm install" -ForegroundColor White
Write-Host "  3. copy .env.example .env  (then edit .env with your MongoDB URI)" -ForegroundColor White
Write-Host "  4. npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "  Open new terminal:" -ForegroundColor Yellow
Write-Host "  5. cd frontend" -ForegroundColor White
Write-Host "  6. npm install" -ForegroundColor White
Write-Host "  7. npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Open http://localhost:5173 in your browser!" -ForegroundColor Green

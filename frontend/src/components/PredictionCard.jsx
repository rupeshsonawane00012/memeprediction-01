import { Link } from "react-router-dom";

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
export default PredictionCard;

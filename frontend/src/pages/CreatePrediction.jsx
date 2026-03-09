import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictionsAPI } from "../services/api";

const CATEGORIES = [
  "Gaming",
  "Tech",
  "Sports",
  "Entertainment",
  "Politics",
  "Science",
  "Other"
];

// Default end date = 7 days from now
const getNextWeek = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split("T")[0];
};

const CreatePrediction = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    endDate: getNextWeek()
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const response = await predictionsAPI.create(form);

      // Redirect to prediction page
      navigate(`/prediction/${response.data._id}`);

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message || "Error creating prediction."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-slide-up">

      <div className="mb-8">
        <h1 className="text-5xl font-display text-white tracking-widest mb-2">
          CREATE PREDICTION
        </h1>

        <p className="text-slate-500 text-sm">
          Ask a yes/no question and let the internet decide.
        </p>
      </div>

      <div className="card p-8">

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm font-mono mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TITLE */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5 font-mono">
              Title <span className="text-red-400">*</span>
            </label>

            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              placeholder="Will GTA 6 release in 2026?"
              required
              maxLength={200}
              className="input"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5 font-mono">
              Description <span className="text-slate-600">(optional)</span>
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Add more context..."
              rows={3}
              maxLength={1000}
              className="input resize-none"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5 font-mono">
              Category
            </label>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="input"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* END DATE */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5 font-mono">
              End Date <span className="text-red-400">*</span>
            </label>

            <input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
              required
              className="input"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn flex-1 border border-[#1e1e2e] text-slate-400 hover:text-white py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-grow py-3 disabled:opacity-50"
            >
              {loading ? "Publishing..." : "🔮 Publish Prediction"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default CreatePrediction;
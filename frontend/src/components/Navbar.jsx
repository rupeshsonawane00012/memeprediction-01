import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="border-b border-[#1e1e2e] px-6 py-4 flex justify-between items-center">
      
      <Link to="/" className="text-2xl font-bold tracking-widest">
        MEME<span className="text-green-400">PREDICT</span>
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/" className="text-slate-400 hover:text-white">
          Predictions
        </Link>

        <Link to="/create" className="bg-purple-600 px-4 py-2 rounded-lg text-white hover:bg-purple-700">
          Create Prediction
        </Link>
      </div>

    </nav>
  );
};

export default Navbar;
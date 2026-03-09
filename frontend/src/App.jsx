import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import PredictionDetail from "./pages/PredictionDetail.jsx";
import CreatePrediction from "./pages/CreatePrediction.jsx";

import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0f]">

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prediction/:id" element={<PredictionDetail />} />
          <Route path="/create" element={<CreatePrediction />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
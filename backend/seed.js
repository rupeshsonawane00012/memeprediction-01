const mongoose = require("mongoose");
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
seed();

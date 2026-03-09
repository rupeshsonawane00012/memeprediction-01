// =============================================
// server.js - Main Entry Point for MemePredict
// =============================================
// This file sets up the Express server, connects
// to MongoDB, and registers all API routes.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// ---- MIDDLEWARE ----

// Allow requests from our frontend (CORS = Cross Origin Resource Sharing)
app.use(cors({
  origin: true,
  credentials: true
}));

// Parse incoming JSON request bodies
app.use(express.json());

// ---- ROUTES ----
// Import and register route files

app.use('/api/predictions', require('./routes/predictions'));
app.use('/api/comments', require('./routes/comments'));

// Health check route - useful to test if server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MemePredict API is running!' });
});

// ---- DATABASE CONNECTION ----
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/memepredict');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Stop the server if DB can't connect
  }
};

// ---- START SERVER ----
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

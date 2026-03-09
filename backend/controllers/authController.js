// =============================================
// controllers/authController.js
// =============================================
// Handles user registration, login, and profile fetch.
// Controllers contain the business logic for each route.

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ---- HELPER: Generate JWT Token ----
// Creates a token that expires in 7 days
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                        // Payload: what we store in the token
    process.env.JWT_SECRET,               // Secret key to sign the token
    { expiresIn: '7d' }                   // Token expires in 7 days
  );
};

// ---- REGISTER ----
// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields.' });
    }

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email
          ? 'Email already registered.'
          : 'Username already taken.',
      });
    }

    // Create the new user (password is hashed automatically in the model)
    const user = await User.create({ username, email, password });

    // Generate JWT token for the new user
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// ---- LOGIN ----
// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // Find user by email (include password since it's excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare entered password with stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Logged in successfully!',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// ---- GET CURRENT USER ----
// GET /api/auth/me  (requires auth middleware)
const getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { register, login, getMe };

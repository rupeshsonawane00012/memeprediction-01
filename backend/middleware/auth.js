// =============================================
// middleware/auth.js - JWT Authentication Middleware
// =============================================
// This middleware protects routes that require login.
// It checks if the request has a valid JWT token.
// Usage: Add `protect` to any route that needs auth.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // JWT tokens are sent in the Authorization header like:
  // "Authorization: Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extract just the token part
  }

  // If no token found, deny access
  if (!token) {
    return res.status(401).json({ message: 'Not authorized. Please log in.' });
  }

  try {
    // Verify the token using our secret key
    // If the token is invalid or expired, this will throw an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request object
    // Now any route handler can use req.user to get the logged-in user
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    next(); // Move on to the route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token. Please log in again.' });
  }
};

module.exports = { protect };

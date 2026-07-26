const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Generate JWT token for a user
 * @param {object} user - User document
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * POST /api/auth/register
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return errorResponse(res, 'Validation failed', 400, {
        fields: 'username, email, and password are required'
      });
    }

    // Validate password length
    if (password.length < 8) {
      return errorResponse(res, 'Validation failed', 400, {
        password: 'Password must be at least 8 characters'
      });
    }

    // Check for existing email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return errorResponse(res, 'Email address already in use', 409);
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user);
    return successResponse(res, {
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = generateToken(user);
    return successResponse(res, {
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };

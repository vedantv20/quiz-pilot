const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Build a consistent user payload for auth responses
 * @param {Object} user - Mongoose user document
 * @returns {Object}
 */
const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  targetExam: user.targetExam,
  educationLevel: user.educationLevel,
  currentClass: user.currentClass,
  targetExams: user.targetExams,
  onboardingCompleted: user.onboardingCompleted,
  streak: user.streak,
  badges: user.badges,
  createdAt: user.createdAt,
  lastActiveDate: user.lastActiveDate
});

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'student' } = req.validatedData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, 'User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = new User({
      name,
      email,
      passwordHash,
      role,
      createdAt: new Date()
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Return user data without password
    const userData = serializeUser(user);

    return sendSuccess(res, 201, 'User registered successfully', {
      user: userData,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Update last active date
    user.lastActiveDate = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Return user data without password
    const userData = serializeUser(user);

    return sendSuccess(res, 200, 'Login successful', {
      user: userData,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = req.user;

    const userData = serializeUser(user);

    return sendSuccess(res, 200, 'User profile retrieved', userData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};

const jwt = require('jsonwebtoken');

/**
 * Generate JWT token with user ID and role
 * @param {String} userId - User's ObjectId
 * @param {String} role - User's role
 * @returns {String} JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // 7 days as specified in AGENTS.md
  );
};

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};
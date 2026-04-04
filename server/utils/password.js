const bcrypt = require('bcryptjs');

/**
 * Hash a plain text password
 * @param {String} password - Plain text password
 * @returns {String} Hashed password
 */
const hashPassword = async (password) => {
  const saltRounds = 12; // Strong salt rounds for security
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare plain text password with hashed password
 * @param {String} plainPassword - Plain text password
 * @param {String} hashedPassword - Hashed password from database
 * @returns {Boolean} True if passwords match
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
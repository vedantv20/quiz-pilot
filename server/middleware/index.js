const authenticate = require('./authenticate');
const { requireRole, requireOwnershipOrAdmin } = require('./authorize');
const errorHandler = require('./errorHandler');
const { validate, validateQuery, validateParams } = require('./validateMiddleware');
const validationSchemas = require('./validation');

module.exports = {
  authenticate,
  requireRole,
  requireOwnershipOrAdmin,
  errorHandler,
  validate,
  validateQuery,
  validateParams,
  ...validationSchemas
};
/**
 * Validation middleware factory
 * Creates middleware to validate request body against Zod schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errorMessages
        });
      }
      next(error);
    }
  };
};

/**
 * Validation middleware for query parameters
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const validatedQuery = schema.parse(req.query);
      req.validatedQuery = validatedQuery;
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Query validation failed',
          errors: errorMessages
        });
      }
      next(error);
    }
  };
};

/**
 * Validation middleware for URL parameters
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      const validatedParams = schema.parse(req.params);
      req.validatedParams = validatedParams;
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Parameter validation failed',
          errors: errorMessages
        });
      }
      next(error);
    }
  };
};

module.exports = {
  validate,
  validateQuery,
  validateParams
};
/**
 * Role-based access control middleware
 * Checks if user has required role(s) to access the route
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // User should be attached by authenticate middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Check if user owns the resource or is admin
 */
const requireOwnershipOrAdmin = (resourceUserIdField = 'createdBy') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource (will be validated in controller)
    req.requireOwnership = true;
    req.ownershipField = resourceUserIdField;
    next();
  };
};

module.exports = {
  requireRole,
  requireOwnershipOrAdmin
};
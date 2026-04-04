const express = require('express');
const { getAllUsers, changeUserRole, deleteUser, getUserStats } = require('../controllers/userController');
const { 
  authenticate, 
  requireRole, 
  validate, 
  updateUserRoleSchema 
} = require('../middleware');

const router = express.Router();

// GET /api/users/stats - Get user statistics (admin only)
router.get('/stats', 
  authenticate, 
  requireRole('admin'), 
  getUserStats
);

// GET /api/users - Get all users (admin only)
router.get('/', 
  authenticate, 
  requireRole('admin'), 
  getAllUsers
);

// PUT /api/users/:id/role - Change user role (admin only)
router.put('/:id/role', 
  authenticate, 
  requireRole('admin'), 
  validate(updateUserRoleSchema), 
  changeUserRole
);

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', 
  authenticate, 
  requireRole('admin'), 
  deleteUser
);

module.exports = router;
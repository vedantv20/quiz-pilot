const express = require('express');
const { getLeaderboard } = require('../controllers/leaderboardController');

const router = express.Router();

// GET /api/leaderboard - Get leaderboard (optional auth for current user rank)
router.get('/', (req, res, next) => {
  // Optional authentication - if token exists, attach user, otherwise continue
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    const { authenticate } = require('../middleware');
    return authenticate(req, res, next);
  }
  next();
}, getLeaderboard);

module.exports = router;
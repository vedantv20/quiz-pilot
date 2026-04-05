const { Attempt, User, Quiz } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Get leaderboard with optional filters
 * GET /api/leaderboard?subject=id&period=weekly
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const { subject, period = 'all' } = req.query;
    const limit = 50; // Top 50 students

    // Build date filter for period
    let dateFilter = {};
    if (period === 'weekly') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      dateFilter.completedAt = { $gte: oneWeekAgo };
    } else if (period === 'monthly') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      dateFilter.completedAt = { $gte: oneMonthAgo };
    }

    // Build aggregation pipeline
    const matchStage = { ...dateFilter };

    // If subject filter is provided, get quizzes for that subject first
    if (subject) {
      const subjectQuizzes = await Quiz.find({ subject }, '_id');
      const quizIds = subjectQuizzes.map(q => q._id);
      matchStage.quiz = { $in: quizIds };
    }

    const leaderboardData = await Attempt.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$student',
          totalAttempts: { $sum: 1 },
          totalScore: { $sum: '$score' },
          totalQuestions: { $sum: { $size: '$answers' } },
          avgPercentage: { $avg: '$percentage' },
          bestScore: { $max: '$percentage' },
          recentAttempt: { $max: '$completedAt' }
        }
      },
      {
        $addFields: {
          overallAccuracy: {
            $cond: {
              if: { $gt: ['$totalQuestions', 0] },
              then: { $multiply: [{ $divide: ['$totalScore', '$totalQuestions'] }, 100] },
              else: 0
            }
          }
        }
      },
      { $sort: { totalScore: -1, overallAccuracy: -1, avgPercentage: -1 } },
      { $limit: limit }
    ]);

    // Populate user data and add rankings
    const leaderboardEntries = await Promise.all(
      leaderboardData.map(async (entry, index) => {
        const user = await User.findById(entry._id).select('name email avatar badges streak');
        
        // Skip entries where user no longer exists (deleted users)
        if (!user) {
          return null;
        }
        
        // Check if user is in top 10 for badge eligibility
        const isTop10 = index < 10;
        if (isTop10 && !user.badges.includes('top_10')) {
          user.badges.push('top_10');
          await user.save();
        }

        return {
          user,
          stats: {
            totalAttempts: entry.totalAttempts,
            totalScore: entry.totalScore,
            overallAccuracy: Math.round(entry.overallAccuracy * 10) / 10,
            avgPercentage: Math.round(entry.avgPercentage * 10) / 10,
            bestScore: entry.bestScore,
            recentAttempt: entry.recentAttempt
          }
        };
      })
    );
    
    // Filter out null entries (deleted users) and add proper rankings
    const populatedLeaderboard = leaderboardEntries
      .filter(entry => entry !== null)
      .map((entry, index) => ({
        rank: index + 1,
        user: {
          _id: entry.user._id,
          name: entry.user.name,
          avatar: entry.user.avatar,
          badges: entry.user.badges,
          streak: entry.user.streak
        },
        stats: entry.stats
      }));

    // Get current user's position if authenticated
    let currentUserRank = null;
    if (req.user) {
      const userEntry = populatedLeaderboard.find(entry => 
        entry.user._id.toString() === req.user._id.toString()
      );
      currentUserRank = userEntry ? userEntry.rank : null;
    }

    const response = {
      leaderboard: populatedLeaderboard,
      filters: {
        subject: subject || null,
        period
      },
      currentUserRank,
      totalUsers: populatedLeaderboard.length
    };

    return sendSuccess(res, 200, 'Leaderboard retrieved successfully', response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaderboard
};
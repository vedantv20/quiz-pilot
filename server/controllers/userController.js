const { User, Attempt, Survey, Quiz } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Get all users with pagination (admin only)
 * GET /api/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, role, search } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (role && ['student', 'teacher', 'admin'].includes(role)) {
      filter.role = role;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(filter);

    // Get additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const attemptCount = await Attempt.countDocuments({ student: user._id });
        const hasSurvey = await Survey.exists({ student: user._id });
        const quizCount = user.role !== 'student' ? await Quiz.countDocuments({ createdBy: user._id }) : 0;

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          targetExam: user.targetExam,
          streak: user.streak,
          badges: user.badges,
          lastActiveDate: user.lastActiveDate,
          createdAt: user.createdAt,
          stats: {
            attemptCount,
            hasSurvey: !!hasSurvey,
            quizCount
          }
        };
      })
    );

    return sendSuccess(res, 200, 'Users retrieved successfully', {
      users: usersWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: skip + limit < totalUsers,
        hasPrev: page > 1
      },
      filters: {
        role: role || null,
        search: search || null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change user role (admin only)
 * PUT /api/users/:id/role
 */
const changeUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.validatedData;
    const adminUser = req.user;

    // Prevent admin from changing their own role
    if (id === adminUser._id.toString()) {
      return sendError(res, 400, 'Cannot change your own role');
    }

    const user = await User.findById(id).select('-passwordHash');
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      targetExam: user.targetExam,
      streak: user.streak,
      badges: user.badges,
      lastActiveDate: user.lastActiveDate,
      createdAt: user.createdAt
    };

    return sendSuccess(res, 200, `User role changed from ${oldRole} to ${role}`, userData);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (admin only)
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminUser = req.user;

    // Prevent admin from deleting themselves
    if (id === adminUser._id.toString()) {
      return sendError(res, 400, 'Cannot delete your own account');
    }

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    // Delete related data
    await Attempt.deleteMany({ student: id });
    await Survey.deleteMany({ student: id });
    
    // If user is a teacher, handle their quizzes
    if (user.role === 'teacher') {
      const userQuizzes = await Quiz.find({ createdBy: id });
      for (const quiz of userQuizzes) {
        // Delete attempts for each quiz
        await Attempt.deleteMany({ quiz: quiz._id });
        // Note: Questions will be deleted via Quiz.deleteMany cascade
      }
      await Quiz.deleteMany({ createdBy: id });
    }

    await User.findByIdAndDelete(id);

    return sendSuccess(res, 200, `User ${user.name} and all related data deleted successfully`);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user statistics summary (admin only)
 * GET /api/users/stats
 */
const getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const teacherCount = await User.countDocuments({ role: 'teacher' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    const totalAttempts = await Attempt.countDocuments();
    const totalSurveys = await Survey.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });

    // Active users (users with attempts in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUserIds = await Attempt.distinct('student', { 
      completedAt: { $gte: sevenDaysAgo } 
    });
    const activeUsers = activeUserIds.length;

    const stats = {
      users: {
        total: totalUsers,
        students: studentCount,
        teachers: teacherCount,
        admins: adminCount,
        recentRegistrations,
        activeUsers
      },
      content: {
        totalAttempts,
        totalSurveys,
        totalQuizzes
      }
    };

    return sendSuccess(res, 200, 'User statistics retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  changeUserRole,
  deleteUser,
  getUserStats
};
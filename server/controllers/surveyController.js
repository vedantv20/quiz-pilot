const { Survey } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Submit survey (student, one per user - upsert)
 * POST /api/surveys
 */
const submitSurvey = async (req, res, next) => {
  try {
    const { 
      targetExam, 
      attemptYear, 
      dailyStudyHours, 
      weakSubjects, 
      strongSubjects, 
      resourcesUsed, 
      stressLevel, 
      confidenceLevel 
    } = req.validatedData;
    
    const student = req.user;

    // Upsert survey (update if exists, create if not)
    const survey = await Survey.findOneAndUpdate(
      { student: student._id },
      {
        targetExam,
        attemptYear,
        dailyStudyHours,
        weakSubjects,
        strongSubjects,
        resourcesUsed,
        stressLevel,
        confidenceLevel,
        submittedAt: new Date()
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    );

    const surveyData = {
      id: survey._id,
      targetExam: survey.targetExam,
      attemptYear: survey.attemptYear,
      dailyStudyHours: survey.dailyStudyHours,
      weakSubjects: survey.weakSubjects,
      strongSubjects: survey.strongSubjects,
      resourcesUsed: survey.resourcesUsed,
      stressLevel: survey.stressLevel,
      confidenceLevel: survey.confidenceLevel,
      submittedAt: survey.submittedAt
    };

    return sendSuccess(res, 200, 'Survey submitted successfully', surveyData);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user's survey response
 * GET /api/surveys/my
 */
const getMySurvey = async (req, res, next) => {
  try {
    const student = req.user;

    const survey = await Survey.findOne({ student: student._id });

    if (!survey) {
      return sendSuccess(res, 200, 'No survey found', null);
    }

    const surveyData = {
      id: survey._id,
      targetExam: survey.targetExam,
      attemptYear: survey.attemptYear,
      dailyStudyHours: survey.dailyStudyHours,
      weakSubjects: survey.weakSubjects,
      strongSubjects: survey.strongSubjects,
      resourcesUsed: survey.resourcesUsed,
      stressLevel: survey.stressLevel,
      confidenceLevel: survey.confidenceLevel,
      submittedAt: survey.submittedAt
    };

    return sendSuccess(res, 200, 'Survey retrieved successfully', surveyData);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all survey responses (admin only)
 * GET /api/surveys
 */
const getAllSurveys = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const surveys = await Survey.find()
      .populate('student', 'name email')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalSurveys = await Survey.countDocuments();

    const surveysData = surveys.map(survey => ({
      id: survey._id,
      student: survey.student,
      targetExam: survey.targetExam,
      attemptYear: survey.attemptYear,
      dailyStudyHours: survey.dailyStudyHours,
      weakSubjects: survey.weakSubjects,
      strongSubjects: survey.strongSubjects,
      resourcesUsed: survey.resourcesUsed,
      stressLevel: survey.stressLevel,
      confidenceLevel: survey.confidenceLevel,
      submittedAt: survey.submittedAt
    }));

    return sendSuccess(res, 200, 'Surveys retrieved successfully', {
      surveys: surveysData,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalSurveys / limit),
        totalSurveys,
        hasNext: skip + limit < totalSurveys,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get aggregated survey analytics (admin only)
 * GET /api/surveys/analytics
 */
const getSurveyAnalytics = async (req, res, next) => {
  try {
    // Get exam distribution
    const examDistribution = await Survey.aggregate([
      {
        $group: {
          _id: '$targetExam',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          exam: '$_id',
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get average daily study hours per exam
    const studyHoursByExam = await Survey.aggregate([
      {
        $group: {
          _id: '$targetExam',
          avgHours: { $avg: '$dailyStudyHours' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          exam: '$_id',
          avgHours: { $round: ['$avgHours', 1] },
          count: 1,
          _id: 0
        }
      },
      { $sort: { avgHours: -1 } }
    ]);

    // Get weak subjects frequency
    const weakSubjectsFreq = await Survey.aggregate([
      { $unwind: '$weakSubjects' },
      {
        $group: {
          _id: '$weakSubjects',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          subject: '$_id',
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get strong subjects frequency
    const strongSubjectsFreq = await Survey.aggregate([
      { $unwind: '$strongSubjects' },
      {
        $group: {
          _id: '$strongSubjects',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          subject: '$_id',
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get resources used frequency
    const resourcesFreq = await Survey.aggregate([
      { $unwind: '$resourcesUsed' },
      {
        $group: {
          _id: '$resourcesUsed',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          resource: '$_id',
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get stress and confidence averages
    const wellbeingStats = await Survey.aggregate([
      {
        $group: {
          _id: null,
          avgStress: { $avg: '$stressLevel' },
          avgConfidence: { $avg: '$confidenceLevel' },
          totalResponses: { $sum: 1 }
        }
      },
      {
        $project: {
          avgStress: { $round: ['$avgStress', 1] },
          avgConfidence: { $round: ['$avgConfidence', 1] },
          totalResponses: 1,
          _id: 0
        }
      }
    ]);

    // Get attempt year distribution
    const attemptYearDist = await Survey.aggregate([
      {
        $group: {
          _id: '$attemptYear',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          year: '$_id',
          count: 1,
          _id: 0
        }
      },
      { $sort: { year: 1 } }
    ]);

    const analytics = {
      examDistribution,
      studyHoursByExam,
      weakSubjectsFrequency: weakSubjectsFreq,
      strongSubjectsFrequency: strongSubjectsFreq,
      resourcesFrequency: resourcesFreq,
      wellbeingStats: wellbeingStats[0] || { avgStress: 0, avgConfidence: 0, totalResponses: 0 },
      attemptYearDistribution: attemptYearDist
    };

    return sendSuccess(res, 200, 'Survey analytics retrieved successfully', analytics);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitSurvey,
  getMySurvey,
  getAllSurveys,
  getSurveyAnalytics
};
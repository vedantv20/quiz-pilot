const { Subject, Quiz } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Get all subjects
 * GET /api/subjects
 */
const getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find()
      .populate('createdBy', 'name email')
      .sort({ name: 1 });

    // Add quiz counts for each subject
    const subjectsWithCounts = await Promise.all(
      subjects.map(async (subject) => {
        const quizCount = await Quiz.countDocuments({ 
          subject: subject._id, 
          isPublished: true 
        });
        
        return {
          _id: subject._id,
          name: subject.name,
          icon: subject.icon,
          description: subject.description,
          quizCount,
          createdBy: subject.createdBy,
          createdAt: subject.createdAt
        };
      })
    );

    return sendSuccess(res, 200, 'Subjects retrieved successfully', subjectsWithCounts);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new subject (Admin only)
 * POST /api/subjects
 */
const createSubject = async (req, res, next) => {
  try {
    const { name, icon, description } = req.validatedData;
    const createdBy = req.user._id;

    const subject = new Subject({
      name,
      icon,
      description,
      createdBy,
      createdAt: new Date()
    });

    await subject.save();
    await subject.populate('createdBy', 'name email');

    const subjectData = {
      _id: subject._id,
      name: subject.name,
      icon: subject.icon,
      description: subject.description,
      createdBy: subject.createdBy,
      createdAt: subject.createdAt
    };

    return sendSuccess(res, 201, 'Subject created successfully', subjectData);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a subject (Admin only)
 * DELETE /api/subjects/:id
 */
const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if subject exists
    const subject = await Subject.findById(id);
    if (!subject) {
      return sendError(res, 404, 'Subject not found');
    }

    // Check if there are quizzes using this subject
    const quizCount = await Quiz.countDocuments({ subject: id });
    if (quizCount > 0) {
      return sendError(res, 400, `Cannot delete subject. ${quizCount} quiz(es) are using this subject.`);
    }

    await Subject.findByIdAndDelete(id);

    return sendSuccess(res, 200, 'Subject deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSubjects,
  createSubject,
  deleteSubject
};
const { z } = require('zod');

// User validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Invalid email format').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'teacher']).optional().default('student')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase(),
  password: z.string().min(1, 'Password is required')
});

// Quiz validation schemas
const createQuizSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().optional(),
  subject: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid subject ID'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  timeLimit: z.number().min(60).max(7200).default(600), // 1 minute to 2 hours
  isMock: z.boolean().default(false),
  tags: z.array(z.string()).optional().default([])
});

const updateQuizSchema = createQuizSchema.partial();

// Question validation schemas
const createQuestionSchema = z.object({
  quiz: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid quiz ID'),
  subject: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid subject ID').optional(),
  text: z.string().min(10, 'Question must be at least 10 characters'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).length(4, 'Must have exactly 4 options'),
  correctIndex: z.number().min(0).max(3, 'Correct index must be 0-3'),
  explanation: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional()
});

const updateQuestionSchema = createQuestionSchema.partial().omit({ quiz: true });

// Attempt validation schema
const submitAttemptSchema = z.object({
  quizId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid quiz ID'),
  answers: z.array(z.number().int().min(-1).max(3)), // -1 for skipped, 0-3 for options
  timeTaken: z.number().min(0, 'Time taken cannot be negative')
});

// Subject validation schema
const createSubjectSchema = z.object({
  name: z.string().min(2, 'Subject name must be at least 2 characters').max(50, 'Name too long'),
  icon: z.string().optional(),
  description: z.string().optional()
});

const updateSubjectSchema = createSubjectSchema.partial();

// Survey validation schema
const submitSurveySchema = z.object({
  targetExam: z.string().min(1, 'Target exam is required'),
  attemptYear: z.number().min(2020).max(2030).optional(),
  dailyStudyHours: z.number().min(1).max(12),
  weakSubjects: z.array(z.string()).optional().default([]),
  strongSubjects: z.array(z.string()).optional().default([]),
  resourcesUsed: z.array(z.string()).optional().default([]),
  stressLevel: z.number().min(1).max(5),
  confidenceLevel: z.number().min(1).max(5)
});

// Bookmark validation schema
const createBookmarkSchema = z.object({
  questionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid question ID')
});

// User role update schema (admin only)
const updateUserRoleSchema = z.object({
  role: z.enum(['student', 'teacher', 'admin'])
});

module.exports = {
  registerSchema,
  loginSchema,
  createQuizSchema,
  updateQuizSchema,
  createQuestionSchema,
  updateQuestionSchema,
  submitAttemptSchema,
  createSubjectSchema,
  updateSubjectSchema,
  submitSurveySchema,
  createBookmarkSchema,
  updateUserRoleSchema
};
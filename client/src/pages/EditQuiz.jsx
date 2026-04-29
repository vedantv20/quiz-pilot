import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Target, 
  Globe, 
  Lock, 
  Save, 
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import { quizzesApi } from '../api/quizzes';
import { questionsApi } from '../api/questions';
import { subjectsApi } from '../api/subjects';
import { useAuthStore } from '../store/authStore';
import BadgeChip from '../components/BadgeChip';
import QuestionCard from '../components/QuestionCard';

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    difficulty: 'medium',
    timeLimit: 600,
    isMock: false,
    isPublished: false,
    tags: []
  });
  
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  // Fetch quiz data
  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizzesApi.getById(id),
  });

  useEffect(() => {
    if (!quiz) return;

    setFormData({
      title: quiz.title || '',
      description: quiz.description || '',
      subject: quiz.subject?._id || '',
      difficulty: quiz.difficulty || 'medium',
      timeLimit: quiz.timeLimit || 600,
      isMock: quiz.isMock || false,
      isPublished: quiz.isPublished || false,
      tags: quiz.tags || []
    });
  }, [quiz]);

  // Fetch quiz questions
  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ['quiz-questions', id],
    queryFn: () => questionsApi.getByQuiz(id),
    enabled: !!id
  });

  // Fetch subjects
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectsApi.getAll
  });

  // Update quiz mutation
  const updateQuizMutation = useMutation({
    mutationFn: (data) => quizzesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['quiz', id]);
      queryClient.invalidateQueries(['teacher-quizzes']);
    },
    onError: (error) => {
      setErrors({ submit: error.message || 'Failed to update quiz' });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  // Publish/unpublish mutation
  const togglePublishMutation = useMutation({
    mutationFn: () => quizzesApi.togglePublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['quiz', id]);
      queryClient.invalidateQueries(['teacher-quizzes']);
    }
  });

  // Delete question mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: questionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['quiz-questions', id]);
      queryClient.invalidateQueries(['quiz', id]);
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleTimeLimitChange = (minutes) => {
    setFormData(prev => ({
      ...prev,
      timeLimit: minutes * 60
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }
    
    if (formData.timeLimit < 60) {
      newErrors.timeLimit = 'Time limit must be at least 1 minute';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    updateQuizMutation.mutate(formData);
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteQuestionMutation.mutate(questionId);
    }
  };

  if (quizLoading) {
    return (
      <div className="page-shell">
        <div className="page-container max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="page-shell">
        <div className="page-container max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground">Quiz not found</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-container max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Edit Quiz
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage quiz settings and questions
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => togglePublishMutation.mutate()}
              disabled={togglePublishMutation.isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                quiz.isPublished
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {quiz.isPublished ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
              {quiz.isPublished ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Quiz Settings */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Basic Information
                </h2>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                      Quiz Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  {/* Subject and Difficulty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          errors.subject ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((subject) => (
                          <option key={subject._id} value={subject._id}>
                            {subject.icon} {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="difficulty" className="block text-sm font-medium text-foreground mb-2">
                        Difficulty Level
                      </label>
                      <select
                        id="difficulty"
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Time Limit */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Time Limit
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[5, 10, 15, 30, 60, 90, 120, 180].map((minutes) => (
                        <button
                          key={minutes}
                          type="button"
                          onClick={() => handleTimeLimitChange(minutes)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                            formData.timeLimit === minutes * 60
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-white dark:bg-gray-700 text-foreground border-border hover:bg-primary/10'
                          }`}
                        >
                          {minutes}m
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="isMock"
                        checked={formData.isMock}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-sm text-foreground">
                        Mock exam mode (hide answers until completion)
                      </span>
                    </label>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                            title="Remove tag"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Display */}
                {errors.submit && (
                  <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar - Questions */}
          <div className="space-y-6">
            {/* Quiz Stats */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Quiz Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Questions</span>
                  <span className="font-medium text-foreground">
                    {questions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <BadgeChip variant={quiz.isPublished ? 'success' : 'warning'}>
                    {quiz.isPublished ? 'Published' : 'Draft'}
                  </BadgeChip>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Attempts</span>
                  <span className="font-medium text-foreground">
                    {quiz.attemptCount || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Questions Management */}
            <div className="bg-card rounded-xl shadow-sm border border-border">
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-foreground">
                    Questions ({questions.length})
                  </h3>
                  <Link
                    to={`${useAuthStore.getState().user?.role === 'admin' ? '/admin/quizzes' : '/teacher/quiz'}/${id}/question/new`}
                    className="btn-primary text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Question
                  </Link>
                </div>
              </div>

              {questionsLoading ? (
                <div className="p-6">
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              ) : questions.length > 0 ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <QuestionManagementCard
                        key={question._id}
                        question={question}
                        index={index + 1}
                        onDelete={() => handleDeleteQuestion(question._id)}
                        quizId={id}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-foreground mb-2">
                    No questions yet
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    Add questions to make your quiz available to students
                  </p>
                  <Link
                    to={`${useAuthStore.getState().user?.role === 'admin' ? '/admin/quizzes' : '/teacher/quiz'}/${id}/question/new`}
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Question
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Question Management Card Component
const QuestionManagementCard = ({ question, index, onDelete, quizId }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="p-4 border border-border rounded-lg hover:bg-muted/80 transition-colors">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-primary">
              Q{index}
            </span>
            <BadgeChip variant={question.difficulty}>{question.difficulty}</BadgeChip>
          </div>
          <p className="text-sm text-foreground font-medium line-clamp-2">
            {question.text}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            4 options • Correct: Option {question.correctIndex + 1}
          </p>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-36 bg-card rounded-lg shadow-lg border border-border z-20">
                <Link
                  to={`${useAuthStore.getState().user?.role === 'admin' ? '/admin/quizzes' : '/teacher/quiz'}/${quizId}/question/${question._id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/80 first:rounded-t-lg"
                  onClick={() => setShowMenu(false)}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 last:rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditQuiz;



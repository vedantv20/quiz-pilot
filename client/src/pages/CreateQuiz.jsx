import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Target, Globe, Lock, Save, Plus } from 'lucide-react';
import { quizzesApi } from '../api/quizzes';
import { subjectsApi } from '../api/subjects';
import { useAuthStore } from '../store/authStore';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    difficulty: 'medium',
    timeLimit: 600, // 10 minutes in seconds
    isMock: false,
    isPublished: false,
    tags: []
  });
  
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch subjects
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectsApi.getAll
  });

  // Create quiz mutation
  const createQuizMutation = useMutation({
    mutationFn: quizzesApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['teacher-quizzes']);
      navigate(`/teacher/quiz/${data._id}/edit`);
    },
    onError: (error) => {
      setErrors({ submit: error.message || 'Failed to create quiz' });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
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
    createQuizMutation.mutate(formData);
  };

  return (
    <div className="page-shell">
      <div className="page-container max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Create New Quiz
            </h1>
            <p className="text-muted-foreground mt-2">
              Set up your quiz details. You'll add questions after creation.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Basic Information
              </h2>

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
                  placeholder="Enter quiz title..."
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
                  placeholder="Describe what this quiz covers..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Subject and Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject *
                  </label>
                  {subjectsLoading ? (
                    <div className="w-full h-12 bg-muted rounded-lg animate-pulse" />
                  ) : (
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
                  )}
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
                  )}
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
            </div>
          </div>

          {/* Quiz Settings */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Quiz Settings
              </h2>

              {/* Time Limit */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Time Limit
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[5, 10, 15, 30, 60, 90, 120, 180].map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      onClick={() => handleTimeLimitChange(minutes)}
                      className={`px-4 py-3 text-sm font-medium rounded-lg border transition-colors ${
                        formData.timeLimit === minutes * 60
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-white dark:bg-gray-700 text-foreground border-border hover:bg-primary/10'
                      }`}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1" />
                      {minutes} min
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Current: {Math.floor(formData.timeLimit / 60)} minutes
                </p>
              </div>

              {/* Quiz Type */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-foreground">
                  Quiz Type
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/80">
                    <input
                      type="checkbox"
                      name="isMock"
                      checked={formData.isMock}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <div>
                      <div className="font-medium text-foreground">Mock Exam Mode</div>
                      <div className="text-sm text-muted-foreground">
                        Students cannot see answers or explanations until after submission
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Tags (Optional)
              </h2>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
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

          {/* Publishing Options */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Publishing Options
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/80">
                  <input
                    type="radio"
                    name="isPublished"
                    value="false"
                    checked={!formData.isPublished}
                    onChange={() => setFormData(prev => ({ ...prev, isPublished: false }))}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <Lock className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-foreground">Save as Draft</div>
                    <div className="text-sm text-muted-foreground">
                      Keep private, add questions later
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/80">
                  <input
                    type="radio"
                    name="isPublished"
                    value="true"
                    checked={formData.isPublished}
                    onChange={() => setFormData(prev => ({ ...prev, isPublished: true }))}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <Globe className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium text-foreground">Publish Now</div>
                    <div className="text-sm text-muted-foreground">
                      Make available to students immediately
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Quiz
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;



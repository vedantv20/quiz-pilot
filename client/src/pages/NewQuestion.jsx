import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { questionsApi } from '../api/questions';
import { quizzesApi } from '../api/quizzes';
import { uploadAPI } from '../api';
import { useAuthStore } from '../store/authStore';
import { ImageUpload } from '../components/ImageUpload';
import toast from 'react-hot-toast';

const NewQuestion = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    text: '',
    image: '',
    imageAlt: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
    difficulty: 'medium'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch quiz to verify ownership and get details
  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => quizzesApi.getById(quizId)
  });

  // Create question mutation
  const createQuestionMutation = useMutation({
    mutationFn: (data) => questionsApi.create({
      ...data,
      quiz: quizId,
      subject: quiz?.subject?._id || quiz?.subject
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['quiz-questions', quizId]);
      queryClient.invalidateQueries(['quiz', quizId]);
      toast.success('Question created successfully');
      navigate(`${useAuthStore.getState().user?.role === 'admin' ? '/admin/quizzes' : '/teacher/quiz'}/${quizId}/edit`);
    },
    onError: (error) => {
      console.error('Create question error:', error);
      toast.error(error.response?.data?.message || 'Failed to create question');
      setErrors({ submit: error.response?.data?.message || 'Failed to create question' });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleOptionChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleImageChange = (imageUrl, filename) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleImageRemove = async () => {
    if (formData.image) {
      try {
        // Extract filename from URL for deletion
        const filename = formData.image.split('/').pop();
        await uploadAPI.deleteQuestionImage(filename);
      } catch (error) {
        console.warn('Failed to delete image:', error);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      image: '',
      imageAlt: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.text.trim()) {
      newErrors.text = 'Question text is required';
    }

    if (formData.options.some(opt => !opt.trim())) {
      newErrors.options = 'All options must be filled';
    }

    if (formData.options.filter(opt => opt.trim()).length < 4) {
      newErrors.options = 'All 4 options are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    createQuestionMutation.mutate(formData);
  };

  if (quizLoading) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="text-center py-8">
            <p className="text-red-600">Quiz not found</p>
          </div>
        </div>
      </div>
    );
  }

  const quizOwnerId = quiz?.createdBy?._id || quiz?.createdBy?.id || quiz?.createdBy;
  const currentUserId = user?._id || user?.id;

  // Check if user owns this quiz (or is admin)
  if (user?.role !== 'admin' && String(quizOwnerId) !== String(currentUserId)) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="text-center py-8">
            <p className="text-red-600">You don't have permission to edit this quiz</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-container max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to={`${useAuthStore.getState().user?.role === 'admin' ? '/admin/quizzes' : '/teacher/quiz'}/${quizId}/edit`}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add New Question</h1>
            <p className="text-muted-foreground">
              Adding question to "{quiz.title}"
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="surface-card">
            {/* Question Text */}
            <div className="space-y-4">
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-foreground mb-2">
                  Question Text *
                </label>
                <textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-field"
                  placeholder="Enter your question here..."
                />
                {errors.text && (
                  <p className="mt-1 text-sm text-red-600">{errors.text}</p>
                )}
              </div>

              {/* Image Upload */}
              <ImageUpload
                imageUrl={formData.image}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
              />

              {/* Image Alt Text */}
              {formData.image && (
                <div>
                  <label htmlFor="imageAlt" className="block text-sm font-medium text-foreground mb-2">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    id="imageAlt"
                    name="imageAlt"
                    value={formData.imageAlt}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Describe the image for accessibility..."
                  />
                </div>
              )}

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Answer Options *
                </label>
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <input
                          type="radio"
                          name="correctIndex"
                          value={index}
                          checked={formData.correctIndex === index}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            correctIndex: parseInt(e.target.value)
                          }))}
                          className="w-4 h-4 text-primary"
                        />
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="input-field flex-1"
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      />
                    </div>
                  ))}
                </div>
                {errors.options && (
                  <p className="mt-1 text-sm text-red-600">{errors.options}</p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Select the radio button next to the correct answer
                </p>
              </div>

              {/* Explanation */}
              <div>
                <label htmlFor="explanation" className="block text-sm font-medium text-foreground mb-2">
                  Explanation (Optional)
                </label>
                <textarea
                  id="explanation"
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field"
                  placeholder="Explain why this is the correct answer..."
                />
              </div>

              {/* Difficulty */}
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-foreground mb-2">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="input-field w-auto"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Link
              to={`${useAuthStore.getState().user?.role === 'admin' ? '/admin/quizzes' : '/teacher/quiz'}/${quizId}/edit`}
              className="btn-secondary"
            >
              Cancel
            </Link>
            
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
                  Create Question
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewQuestion;

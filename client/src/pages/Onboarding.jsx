import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  GraduationCap, 
  Target, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Loader2,
  Sparkles
} from 'lucide-react';
import { onboardingAPI } from '../api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const EDUCATION_LEVELS = [
  { value: 'class_11', label: 'Class 11', icon: '📚', description: 'Preparing for 11th standard exams' },
  { value: 'class_12', label: 'Class 12', icon: '🎓', description: 'Preparing for 12th standard and entrance exams' },
  { value: 'undergraduate', label: 'Undergraduate', icon: '🏛️', description: 'B.Tech, B.Sc, BCA, or similar degree' },
  { value: 'postgraduate', label: 'Postgraduate', icon: '📖', description: 'M.Tech, M.Sc, MCA, or similar degree' },
  { value: 'working_professional', label: 'Working Professional', icon: '💼', description: 'Currently employed, upskilling' },
  { value: 'other', label: 'Other', icon: '🎯', description: 'Self-learner or different background' },
];

const TARGET_EXAMS_BY_LEVEL = {
  class_11: [
    { value: 'Board Exam', label: 'Board Exam', icon: '📝' },
    { value: 'JEE Foundation', label: 'JEE Foundation', icon: '🎯' },
    { value: 'NEET Foundation', label: 'NEET Foundation', icon: '⚕️' },
    { value: 'Olympiad', label: 'Olympiad', icon: '🏅' },
  ],
  class_12: [
    { value: 'Board Exam', label: 'Board Exam', icon: '📝' },
    { value: 'JEE Main', label: 'JEE Main', icon: '🎯' },
    { value: 'JEE Advanced', label: 'JEE Advanced', icon: '🚀' },
    { value: 'NEET UG', label: 'NEET UG', icon: '⚕️' },
    { value: 'MHTCET', label: 'MHTCET', icon: '🏛️' },
    { value: 'BITSAT', label: 'BITSAT', icon: '💡' },
    { value: 'VITEEE', label: 'VITEEE', icon: '🎓' },
  ],
  undergraduate: [
    { value: 'Placement', label: 'Campus Placement', icon: '💼' },
    { value: 'GATE CS', label: 'GATE CS/IT', icon: '🎓' },
    { value: 'Coding Interview', label: 'Coding Interview', icon: '💻' },
    { value: 'University Exam', label: 'University Exam', icon: '📚' },
    { value: 'GRE', label: 'GRE', icon: '✈️' },
  ],
  postgraduate: [
    { value: 'GATE CS', label: 'GATE CS/IT', icon: '🎓' },
    { value: 'Placement', label: 'Placement', icon: '💼' },
    { value: 'Senior Interview', label: 'Senior Position Interview', icon: '👔' },
    { value: 'Research', label: 'Research', icon: '🔬' },
  ],
  working_professional: [
    { value: 'Senior Interview', label: 'Senior Position Interview', icon: '👔' },
    { value: 'Architecture Interview', label: 'System Design Interview', icon: '🏗️' },
    { value: 'Certification', label: 'Professional Certification', icon: '📜' },
    { value: 'Upskilling', label: 'Upskilling', icon: '📈' },
  ],
  other: [
    { value: 'Self Learning', label: 'Self Learning', icon: '📖' },
    { value: 'Competitive Programming', label: 'Competitive Programming', icon: '🏆' },
    { value: 'General Knowledge', label: 'General Knowledge', icon: '🧠' },
  ],
};

const Onboarding = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setUser, skipOnboarding } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSkipping, setIsSkipping] = useState(false);
  const [formData, setFormData] = useState({
    educationLevel: '',
    currentClass: '',
    targetExams: [],
  });

  // Check if user already completed onboarding
  useEffect(() => {
    if (user?.onboardingCompleted) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Complete onboarding mutation
  const { mutate: completeOnboarding, isPending } = useMutation({
    mutationFn: (data) => onboardingAPI.completeOnboarding(data),
    onSuccess: (response) => {
      // Update user in store immediately
      const updatedUser = response.data.user;
      setUser(updatedUser);
      
      // Also force update localStorage to be extra sure
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Welcome to QuizPilot! Your personalized quizzes are ready.');
      
      // Use a slight delay to ensure state has propagated
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to complete onboarding');
    },
  });

  // Handle skip onboarding
  const handleSkipOnboarding = async () => {
    try {
      setIsSkipping(true);
      const result = await skipOnboarding();
      
      if (result.success) {
        // Force update localStorage to be extra sure
        localStorage.setItem('user', JSON.stringify(result.user));
        
        toast.success('You can complete your profile later from settings!');
        
        // Use a slight delay to ensure state has propagated
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        toast.error(result.message || 'Failed to skip onboarding');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSkipping(false);
    }
  };

  const handleEducationSelect = (level) => {
    setFormData(prev => ({
      ...prev,
      educationLevel: level,
      targetExams: [], // Reset target exams when education level changes
    }));
  };

  const handleExamToggle = (exam) => {
    setFormData(prev => {
      const isSelected = prev.targetExams.includes(exam);
      return {
        ...prev,
        targetExams: isSelected 
          ? prev.targetExams.filter(e => e !== exam)
          : [...prev.targetExams, exam],
      };
    });
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.educationLevel) {
      toast.error('Please select your education level');
      return;
    }
    if (currentStep === 2 && formData.targetExams.length === 0) {
      toast.error('Please select at least one target exam');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (formData.targetExams.length === 0) {
      toast.error('Please select at least one target exam');
      return;
    }
    completeOnboarding(formData);
  };

  const availableExams = TARGET_EXAMS_BY_LEVEL[formData.educationLevel] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to QuizPilot
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let's personalize your learning experience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                transition-all duration-300
                ${currentStep >= step 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}
              `}>
                {currentStep > step ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 3 && (
                <div className={`
                  w-16 sm:w-24 h-1 mx-2
                  ${currentStep > step ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-700'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Step 1: Education Level */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <GraduationCap className="w-12 h-12 mx-auto text-violet-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  What's your current education level?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  This helps us suggest the most relevant quizzes for you
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {EDUCATION_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handleEducationSelect(level.value)}
                    className={`
                      p-4 rounded-xl border-2 text-left transition-all duration-200
                      ${formData.educationLevel === level.value
                        ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{level.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {level.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {level.description}
                        </p>
                      </div>
                      {formData.educationLevel === level.value && (
                        <Check className="w-5 h-5 text-violet-600 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Target Exams */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Target className="w-12 h-12 mx-auto text-violet-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  What are you preparing for?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Select all that apply - you can change this later
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableExams.map((exam) => (
                  <button
                    key={exam.value}
                    onClick={() => handleExamToggle(exam.value)}
                    className={`
                      p-4 rounded-xl border-2 text-left transition-all duration-200
                      ${formData.targetExams.includes(exam.value)
                        ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{exam.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {exam.label}
                      </span>
                      {formData.targetExams.includes(exam.value) && (
                        <Check className="w-5 h-5 text-violet-600 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {formData.targetExams.length > 0 && (
                <div className="mt-6 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                  <p className="text-sm text-violet-700 dark:text-violet-300">
                    <span className="font-medium">Selected: </span>
                    {formData.targetExams.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <BookOpen className="w-12 h-12 mx-auto text-violet-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  You're all set!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Review your preferences and start learning
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Education Level
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {EDUCATION_LEVELS.find(l => l.value === formData.educationLevel)?.label}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Target Exams
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.targetExams.map((exam) => (
                      <span
                        key={exam}
                        className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium"
                      >
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl text-white">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Personalized Quizzes Await!</h3>
                    <p className="text-violet-100 text-sm mt-1">
                      Based on your selections, we'll show you quizzes tailored to your learning goals.
                      You can always update your preferences from your profile.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                ${currentStep === 1
                  ? 'opacity-0 pointer-events-none'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-all"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Start Learning
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Skip option */}
        <div className="text-center mt-6">
          <button
            onClick={handleSkipOnboarding}
            disabled={isSkipping}
            className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {isSkipping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Skipping...
              </>
            ) : (
              'Skip for now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

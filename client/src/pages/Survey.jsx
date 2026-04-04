import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { surveyAPI } from '../api'
import { SurveyStep } from '../components/SurveyStep'
import toast from 'react-hot-toast'

export const Survey = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    targetExam: '',
    attemptYear: new Date().getFullYear(),
    dailyStudyHours: 4,
    weakSubjects: [],
    strongSubjects: [],
    resourcesUsed: [],
    stressLevel: 3,
    confidenceLevel: 3
  })

  // Check if user has already submitted survey
  const { data: existingSurvey } = useQuery({
    queryKey: ['survey', 'my'],
    queryFn: () => surveyAPI.getMy().then(res => res.data.data),
    retry: false
  })

  // Submit survey mutation
  const submitSurvey = useMutation({
    mutationFn: (data) => surveyAPI.submit(data),
    onSuccess: () => {
      toast.success('Survey completed successfully!')
      setCurrentStep(6) // Show completion step
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit survey')
    }
  })

  // Load existing survey data if available
  useEffect(() => {
    if (existingSurvey) {
      setFormData({
        targetExam: existingSurvey.targetExam || '',
        attemptYear: existingSurvey.attemptYear || new Date().getFullYear(),
        dailyStudyHours: existingSurvey.dailyStudyHours || 4,
        weakSubjects: existingSurvey.weakSubjects || [],
        strongSubjects: existingSurvey.strongSubjects || [],
        resourcesUsed: existingSurvey.resourcesUsed || [],
        stressLevel: existingSurvey.stressLevel || 3,
        confidenceLevel: existingSurvey.confidenceLevel || 3
      })
    }
  }, [existingSurvey])

  const targetExams = [
    { id: 'JEE', name: 'JEE Main/Advanced', icon: '🎯' },
    { id: 'NEET', name: 'NEET', icon: '🏥' },
    { id: 'UPSC', name: 'UPSC Civil Services', icon: '🏛️' },
    { id: 'CAT', name: 'CAT/MBA', icon: '💼' },
    { id: 'GATE', name: 'GATE', icon: '⚙️' },
    { id: 'BOARD', name: 'Board Exams', icon: '📚' },
    { id: 'OTHER', name: 'Other', icon: '📝' }
  ]

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 
    'English', 'History', 'Geography', 'Economics',
    'Political Science', 'Computer Science', 'Statistics'
  ]

  const resources = [
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'coaching', name: 'Coaching Classes', icon: '🏫' },
    { id: 'books', name: 'Textbooks', icon: '📚' },
    { id: 'apps', name: 'Mobile Apps', icon: '📱' },
    { id: 'tests', name: 'Online Tests', icon: '💻' },
    { id: 'groups', name: 'Study Groups', icon: '👥' }
  ]

  const stressEmojis = ['😌', '😐', '😟', '😰', '😵']
  const confidenceEmojis = ['😟', '😐', '🙂', '😊', '😎']

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit survey
      submitSurvey.mutate(formData)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.targetExam !== ''
      case 2:
        return formData.dailyStudyHours > 0 && formData.attemptYear > 0
      case 3:
        return formData.weakSubjects.length > 0 || formData.strongSubjects.length > 0
      case 4:
        return formData.resourcesUsed.length > 0
      case 5:
        return true
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SurveyStep
            currentStep={1}
            totalSteps={5}
            title="What's your target exam?"
            className="max-w-2xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {targetExams.map(exam => (
                <label
                  key={exam.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.targetExam === exam.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="targetExam"
                    value={exam.id}
                    checked={formData.targetExam === exam.id}
                    onChange={(e) => handleInputChange('targetExam', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{exam.icon}</div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {exam.name}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </SurveyStep>
        )

      case 2:
        return (
          <SurveyStep
            currentStep={2}
            totalSteps={5}
            title="Tell us about your study habits"
          >
            <div className="space-y-8">
              {/* Daily Study Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  How many hours do you study daily?
                </label>
                <div className="px-3">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="0.5"
                    value={formData.dailyStudyHours}
                    onChange={(e) => handleInputChange('dailyStudyHours', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                    <span>1h</span>
                    <span className="font-medium text-primary-600 dark:text-primary-400">
                      {formData.dailyStudyHours}h per day
                    </span>
                    <span>12h</span>
                  </div>
                </div>
              </div>

              {/* Attempt Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  What year are you planning to attempt the exam?
                </label>
                <input
                  type="number"
                  min={new Date().getFullYear()}
                  max={new Date().getFullYear() + 5}
                  value={formData.attemptYear}
                  onChange={(e) => handleInputChange('attemptYear', parseInt(e.target.value))}
                  className="input-field max-w-xs"
                />
              </div>
            </div>
          </SurveyStep>
        )

      case 3:
        return (
          <SurveyStep
            currentStep={3}
            totalSteps={5}
            title="Subject assessment"
          >
            <div className="space-y-8">
              {/* Weak Subjects */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Which subjects do you find challenging? (Select multiple)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {subjects.map(subject => (
                    <label
                      key={`weak-${subject}`}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        formData.weakSubjects.includes(subject)
                          ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.weakSubjects.includes(subject)}
                        onChange={() => handleArrayToggle('weakSubjects', subject)}
                        className="sr-only"
                      />
                      <div className="text-center font-medium text-sm">
                        {subject}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Strong Subjects */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Which subjects are your strengths? (Select multiple)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {subjects.map(subject => (
                    <label
                      key={`strong-${subject}`}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        formData.strongSubjects.includes(subject)
                          ? 'border-green-300 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.strongSubjects.includes(subject)}
                        onChange={() => handleArrayToggle('strongSubjects', subject)}
                        className="sr-only"
                      />
                      <div className="text-center font-medium text-sm">
                        {subject}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </SurveyStep>
        )

      case 4:
        return (
          <SurveyStep
            currentStep={4}
            totalSteps={5}
            title="What resources do you use for studying?"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map(resource => (
                <label
                  key={resource.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.resourcesUsed.includes(resource.id)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.resourcesUsed.includes(resource.id)}
                    onChange={() => handleArrayToggle('resourcesUsed', resource.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{resource.icon}</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {resource.name}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </SurveyStep>
        )

      case 5:
        return (
          <SurveyStep
            currentStep={5}
            totalSteps={5}
            title="How are you feeling about your preparation?"
          >
            <div className="space-y-8">
              {/* Stress Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                  What's your current stress level?
                </label>
                <div className="flex items-center justify-center space-x-4">
                  {stressEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleInputChange('stressLevel', index + 1)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all ${
                        formData.stressLevel === index + 1
                          ? 'bg-primary-100 dark:bg-primary-900 ring-4 ring-primary-500'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {['Very Low', 'Low', 'Moderate', 'High', 'Very High'][formData.stressLevel - 1]}
                </div>
              </div>

              {/* Confidence Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                  How confident do you feel about your exam?
                </label>
                <div className="flex items-center justify-center space-x-4">
                  {confidenceEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleInputChange('confidenceLevel', index + 1)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all ${
                        formData.confidenceLevel === index + 1
                          ? 'bg-primary-100 dark:bg-primary-900 ring-4 ring-primary-500'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {['Very Low', 'Low', 'Moderate', 'High', 'Very High'][formData.confidenceLevel - 1]}
                </div>
              </div>
            </div>
          </SurveyStep>
        )

      case 6:
        return (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="mb-8">
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Thank You!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Your survey has been submitted successfully. This will help us personalize your learning experience.
              </p>
            </div>

            {/* Survey Summary */}
            <div className="card text-left mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Your Responses Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Target Exam:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {targetExams.find(e => e.id === formData.targetExam)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Daily Study Hours:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formData.dailyStudyHours}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Attempt Year:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formData.attemptYear}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Weak Subjects:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formData.weakSubjects.length} selected
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Strong Subjects:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formData.strongSubjects.length} selected
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Resources Used:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formData.resourcesUsed.length} selected
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary text-lg px-8 py-3"
            >
              Continue to Dashboard
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {currentStep <= 5 && (
          <>
            {renderStep()}
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between max-w-2xl mx-auto mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Step {currentStep} of 5
              </div>

              <button
                onClick={nextStep}
                disabled={!canProceed() || submitSurvey.isPending}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitSurvey.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : currentStep === 5 ? (
                  <>
                    <span>Submit Survey</span>
                    <CheckCircle className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {currentStep === 6 && renderStep()}
      </div>
    </div>
  )
}

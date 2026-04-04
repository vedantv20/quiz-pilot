import { CheckCircle } from 'lucide-react'

export const SurveyStep = ({ 
  currentStep, 
  totalSteps, 
  title, 
  children, 
  className = "" 
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Progress Dots */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step < currentStep
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : step === currentStep
                    ? 'bg-primary-100 border-primary-600 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                    : 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500'
                }`}
              >
                {step < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{step}</span>
                )}
              </div>
              {step < totalSteps && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    step < currentStep 
                      ? 'bg-primary-600' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Step Content */}
      <div className="card">
        {children}
      </div>
    </div>
  )
}
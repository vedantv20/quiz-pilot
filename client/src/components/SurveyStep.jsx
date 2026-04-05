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
                    ? 'bg-primary border-primary text-primary-foreground'
                    : step === currentStep
                    ? 'bg-primary/10 border-primary text-primary dark:bg-primary/20'
                    : 'bg-muted border-border text-muted-foreground'
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
                      ? 'bg-primary' 
                      : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Step Content */}
      <div className="surface-card">
        {children}
      </div>
    </div>
  )
}



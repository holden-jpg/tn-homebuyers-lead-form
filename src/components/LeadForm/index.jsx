import { useFormStep } from '../../hooks/useFormStep';
import { ProgressBar } from '../ProgressBar';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Complete } from './Complete';

export function LeadForm() {
  const {
    currentStep,
    formData,
    isSubmitting,
    submitError,
    isComplete,
    leadId,
    progressPercent,
    totalSteps,
    submitStep1,
    submitStep,
    prevStep,
  } = useFormStep();

  if (isComplete) {
    return <Complete leadId={leadId} />;
  }

  return (
    <div className="form-wrapper">
      <div className="form-step">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          progressPercent={progressPercent}
        />

        {/* Global submission error */}
        {submitError && (
          <div className="form-error-banner">
            {submitError}
          </div>
        )}

      {currentStep === 1 && (
        <Step1
          defaultValues={formData}
          onSubmit={submitStep1}
          isSubmitting={isSubmitting}
        />
      )}

      {currentStep === 2 && (
        <Step2
          defaultValues={formData}
          onSubmit={(data) => submitStep(data, 2)}
          onBack={prevStep}
          isSubmitting={isSubmitting}
        />
      )}

      {currentStep === 3 && (
        <Step3
          defaultValues={formData}
          onSubmit={(data) => submitStep(data, 3)}
          onBack={prevStep}
          isSubmitting={isSubmitting}
        />
      )}
      </div>
    </div>
  );
}
import { useFormStep } from '../../hooks/useFormStep';
import { ProgressBar } from '../ProgressBar';
import { Step1 } from './Step1';
import { Step1Short } from './Step1Short';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Complete } from './Complete';

export function LeadForm({ variant = 'full', fullFormUrl = '' }) {
  const {
    currentStep,
    formData,
    isSubmitting,
    submitError,
    isComplete,
    progressPercent,
    totalSteps,
    submitStep1,
    submitStep,
    prevStep,
  } = useFormStep({ variant, fullFormUrl });

  // ─── Short variant ───────────────────────────────────────────────────────
  if (variant === 'short') {
    return (
      <div className="form-wrapper form-wrapper--short">
        <div className="form-step">
          {submitError && (
            <div className="form-error-banner">{submitError}</div>
          )}
          <Step1Short
            defaultValues={formData}
            onSubmit={submitStep1}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    );
  }

  // ─── Full variant ────────────────────────────────────────────────────────
  if (isComplete) {
    return <Complete />;
  }

  return (
    <div className="form-wrapper">
      <div className="form-step">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          progressPercent={progressPercent}
        />

        {submitError && (
          <div className="form-error-banner">{submitError}</div>
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

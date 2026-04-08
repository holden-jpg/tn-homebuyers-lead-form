export function ProgressBar({ currentStep, totalSteps, progressPercent }) {
  return (
    <div className="progress-container">
      <div className="progress-steps">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isComplete = step < currentStep;
          const isActive = step === currentStep;

          return (
            <div
              key={step}
              className={`progress-step ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
            >
              <div className="progress-step-circle">
                {isComplete ? '✓' : step}
              </div>
              <span className="progress-step-label">
                {step === 1 && 'Your Details'}
                {step === 2 && 'Property'}
                {step === 3 && 'Sale Intent'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
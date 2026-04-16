import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step3Schema } from '../../schemas/formSchemas';

const TIME_TO_SELL_OPTIONS = [
  { label: 'As soon as possible', value: 'ASAP' },
  { label: 'Less than 90 days', value: 'Less than 90 days' },
  { label: 'Less than 6 months', value: 'Less than 6 months' },
  { label: "I'm not in a rush", value: 'Not in a Rush' },
];

export function Step3({ defaultValues, onSubmit, onBack, isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues,
  });

  return (
    <>
      <h2 className="form-step-title">Almost done!</h2>
      <p className="form-step-subtitle">
        Just a couple more questions to help us prepare your offer.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* Time to sell */}
        <div className="form-field">
          <label htmlFor="timeToSell">How soon are you looking to sell? *</label>
          <select
            id="timeToSell"
            {...register('timeToSell')}
            className={errors.timeToSell ? 'input-error' : ''}
          >
            <option value="">Select...</option>
            {TIME_TO_SELL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.timeToSell && (
            <span className="field-error">{errors.timeToSell.message}</span>
          )}
        </div>

{/* Additional notes */}
        <div className="form-field">
          <label htmlFor="additionalNotes">
            Anything else you'd like us to know?
          </label>
          <textarea
            id="additionalNotes"
            rows={4}
            placeholder="Any additional details about the property or your situation..."
            {...register('additionalNotes')}
            className={errors.additionalNotes ? 'input-error' : ''}
          />
          {errors.additionalNotes && (
            <span className="field-error">{errors.additionalNotes.message}</span>
          )}
        </div>

        {/* Navigation */}
        <div className="form-navigation">
          <button
            type="button"
            className="btn-secondary"
            onClick={onBack}
            disabled={isSubmitting}
          >
            ← Back
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Get My Cash Offer'}
          </button>
        </div>
      </form>
    </>
  );
}
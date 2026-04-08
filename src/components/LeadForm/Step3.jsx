import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step3Schema } from '../../schemas/formSchemas';

const TIME_TO_SELL_OPTIONS = [
  { label: 'As Soon As Possible', value: 'ASAP' },
  { label: 'Within 2 Weeks', value: '2 Weeks' },
  { label: 'Within 1 Month', value: '30 Days' },
  { label: 'Within 2 Months', value: '60 Days' },
  { label: 'Within 6 Months', value: '90 Days+' },
  { label: 'Within a Year', value: '6 Months+' },
  { label: 'Just Exploring', value: 'Not in a Rush' },
];

// Get the final list from Tennessee team per the spec
const HOW_DID_YOU_HEAR_OPTIONS = [
  { label: 'TV', value: 'TV' },
  { label: 'Family or Friend', value: 'Referral' },
  { label: 'Google', value: 'SEO / Google General Search' },
  { label: 'YouTube', value: 'YouTube' },
  { label: 'Facebook', value: 'Facebook' },
  { label: 'Previous Seller', value: 'Previous Seller' },
  { label: 'Radio', value: 'Radio' },
  { label: 'Other', value: 'Other (LAST RESORT) - put details in notes' },
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
    <div className="form-step">
      <h2 className="form-step-title">Almost done!</h2>
      <p className="form-step-subtitle">
        Just a couple more questions to help us prepare your offer.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* Time to sell — radio buttons per mobile-first spec */}
        <div className="form-field">
          <label>How soon are you looking to sell? *</label>
          <div className="radio-group">
            {TIME_TO_SELL_OPTIONS.map((option) => (
              <label key={option.value} className="radio-option">
                <input
                  type="radio"
                  value={option.value}
                  {...register('timeToSell')}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {errors.timeToSell && (
            <span className="field-error">{errors.timeToSell.message}</span>
          )}
        </div>

        {/* How did you hear */}
        <div className="form-field">
          <label htmlFor="howDidYouHear">How did you hear about us?</label>
          <select id="howDidYouHear" {...register('howDidYouHear')}>
            <option value="">Select...</option>
            {HOW_DID_YOU_HEAR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
            {isSubmitting ? 'Submitting...' : 'Get My Cash Offer →'}
          </button>
        </div>
      </form>
    </div>
  );
}
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2Schema } from '../../schemas/formSchemas';

const PROPERTY_TYPES = [
  'Single Family',
  'Multi Family',
  'Condo',
  'Townhouse',
  'Mobile Home',
  'Land',
  'Other',
];

const PROPERTY_CONDITIONS = [
  'Move-in Ready',
  'Needs Light Repairs',
  'Needs Major Repairs',
  'Distressed',
];

const OCCUPANCY_STATUSES = [
  'Owner Occupied',
  'Tenant Occupied',
  'Vacant',
  'Unknown',
];

export function Step2({
  defaultValues,
  onSubmit,
  onBack,
  isSubmitting,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues,
  });

  return (
    <div className="form-step">
      <h2 className="form-step-title">Tell us about the property</h2>
      <p className="form-step-subtitle">
        The more you share, the faster we can prepare your offer.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* Address */}
        <div className="form-field">
          <label htmlFor="addressLine1">Address Line 1 *</label>
          <input
            id="addressLine1"
            type="text"
            autoComplete="address-line1"
            placeholder="123 Main St"
            {...register('addressLine1')}
            className={errors.addressLine1 ? 'input-error' : ''}
          />
          {errors.addressLine1 && (
            <span className="field-error">{errors.addressLine1.message}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="addressLine2">Address Line 2</label>
          <input
            id="addressLine2"
            type="text"
            autoComplete="address-line2"
            placeholder="Apt, Suite, Unit (optional)"
            {...register('addressLine2')}
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              autoComplete="address-level2"
              placeholder="Nashville"
              {...register('city')}
            />
          </div>

          <div className="form-field">
            <label htmlFor="state">State</label>
            <input
              id="state"
              type="text"
              autoComplete="address-level1"
              placeholder="TN"
              maxLength={2}
              {...register('state')}
            />
          </div>

          <div className="form-field">
            <label htmlFor="zipCode">Zip Code</label>
            <input
              id="zipCode"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="37201"
              maxLength={5}
              {...register('zipCode')}
            />
          </div>
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
            {isSubmitting ? 'Saving...' : 'Next Step →'}
          </button>
        </div>
      </form>
    </div>
  );
}
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2Schema } from '../../schemas/formSchemas';
import stepImage from '../../assets/step2-image.jpg';

export function Step2({ defaultValues, onSubmit, onBack, isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues,
  });

  const formatPhone = (e) => {
    let digits = e.target.value.replace(/\D/g, '');
    // Strip leading country code (1) if autofilled as 11 digits
    if (digits.length === 11 && digits.startsWith('1')) {
      digits = digits.slice(1);
    }
    digits = digits.slice(0, 10);
    const formatted = digits
      .replace(/(\d{3})(\d{0,3})/, '$1-$2')
      .replace(/(\d{3}-\d{3})(\d{0,4})/, '$1-$2');
    e.target.value = formatted;
  };

  return (
    <>
      <img src={stepImage} alt="" className="step-image" />
      <h2 className="form-step-title">How can we contact you?</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        <div className="form-field">
          <label htmlFor="fullName">Full Name *</label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="John Smith"
            {...register('fullName')}
            className={errors.fullName ? 'input-error' : ''}
          />
          {errors.fullName && (
            <span className="field-error">{errors.fullName.message}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="john@example.com"
            {...register('email')}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && (
            <span className="field-error">{errors.email.message}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone Number *</label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="615-555-1234"
            {...register('phone')}
            onInput={formatPhone}
            className={errors.phone ? 'input-error' : ''}
          />
          {errors.phone && (
            <span className="field-error">{errors.phone.message}</span>
          )}
        </div>

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
            {isSubmitting ? 'Saving...' : 'Final Step →'}
          </button>
        </div>

        <p className="sms-disclaimer">
          Message and data rates may apply. By providing my mobile number, I agree to receive text messages at the number provided. Text STOP to 615-299-5520 to opt out at any time. For info text HELP to 615-299-5520. View our <a href="https://299cash.com/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        </p>
      </form>
    </>
  );
}

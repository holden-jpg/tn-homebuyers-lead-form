import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema } from '../../schemas/formSchemas';

export function Step1({ defaultValues, onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues,
  });

  // Auto-format phone as user types: 1111111111 → 111-111-1111
  const formatPhone = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    const formatted = digits
      .replace(/(\d{3})(\d{0,3})/, '$1-$2')
      .replace(/(\d{3}-\d{3})(\d{0,4})/, '$1-$2');
    e.target.value = formatted;
  };

  return (
    <>
      <h2 className="form-step-title">Let's start with your details</h2>
      <p className="form-step-subtitle">
        We'll use this to send you your cash offer.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Full Name */}
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

        {/* Email */}
        <div className="form-field">
          <label htmlFor="email">Email Address *</label>
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

        {/* Phone */}
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

        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Next Step →'}
        </button>
      </form>
    </>
  );
}
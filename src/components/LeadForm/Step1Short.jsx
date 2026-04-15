import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema } from '../../schemas/formSchemas';

export function Step1Short({ defaultValues, onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues,
  });

  const formatPhone = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    const formatted = digits
      .replace(/(\d{3})(\d{0,3})/, '$1-$2')
      .replace(/(\d{3}-\d{3})(\d{0,4})/, '$1-$2');
    e.target.value = formatted;
  };

  return (
    <form className="short-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="short-form-fields">
        <div className="form-field">
          <label htmlFor="sf-fullName">Full Name *</label>
          <input
            id="sf-fullName"
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
          <label htmlFor="sf-phone">Phone Number *</label>
          <input
            id="sf-phone"
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
          className="btn-primary short-form-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Get My Cash Offer →'}
        </button>
      </div>
    </form>
  );
}

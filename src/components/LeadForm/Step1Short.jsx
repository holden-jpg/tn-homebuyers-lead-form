import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema } from '../../schemas/formSchemas';
import { usePlacesAutocomplete } from '../../hooks/usePlacesAutocomplete';

export function Step1Short({ defaultValues, onSubmit, isSubmitting }) {
  const honeypotRef = useRef(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues,
  });

  const addressComponentsRef = useRef({});

  const getMergedRef = usePlacesAutocomplete(({ propertyAddress, ...components }) => {
    addressComponentsRef.current = components;
    setValue('propertyAddress', propertyAddress, { shouldValidate: true });
  });

  const { ref: registerRef, ...addressReg } = register('propertyAddress');

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit({ ...data, ...addressComponentsRef.current, _hp: honeypotRef.current?.value || '' });
  });

  return (
    <form className="short-form" onSubmit={handleFormSubmit} noValidate>
      {/* Honeypot */}
      <div className="hp-field" aria-hidden="true">
        <input
          ref={honeypotRef}
          type="text"
          name="website"
          tabIndex="-1"
          autoComplete="off"
        />
      </div>

      <div className="short-form-fields">
        <div className="form-field">
          <input
            id="sf-propertyAddress"
            type="text"
            placeholder="123 Main St, Nashville, TN"
            autoComplete="off"
            ref={getMergedRef(registerRef)}
            {...addressReg}
            className={errors.propertyAddress ? 'input-error' : ''}
          />
          {errors.propertyAddress && (
            <span className="field-error">{errors.propertyAddress.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary short-form-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Get Started'}
        </button>
      </div>
    </form>
  );
}

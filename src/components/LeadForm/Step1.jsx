import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema } from '../../schemas/formSchemas';
import { usePlacesAutocomplete } from '../../hooks/usePlacesAutocomplete';
import stepImage from '../../assets/step1-image.jpeg';

export function Step1({ defaultValues, onSubmit, isSubmitting }) {
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
    <>
      <img src={stepImage} alt="" style={{ display: 'block', width: '70%', margin: '0 auto 24px', borderRadius: '12px' }} />
      <h2 className="form-step-title">Sell your house the easy way!</h2>

      <form onSubmit={handleFormSubmit} noValidate>
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

        <div className="form-field">
          <label htmlFor="propertyAddress">Property Address *</label>
          <input
            id="propertyAddress"
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
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Get Started'}
        </button>
      </form>
    </>
  );
}

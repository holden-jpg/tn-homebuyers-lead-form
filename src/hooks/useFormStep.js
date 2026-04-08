import { useState, useCallback, useEffect } from 'react';
import { useUtmParams } from './useUtmParams';
import {
  step1Defaults,
  step2Defaults,
  step3Defaults,
} from '../schemas/formSchemas';

const STEP_URLS = {
  1: '/get-offer/step-1',
  2: '/get-offer/step-2',
  3: '/get-offer/step-3',
  complete: '/get-offer/complete',
};

const TOTAL_STEPS = 3;
const API_URL = import.meta.env.VITE_API_URL || '';

export function useFormStep() {
  const utmParams = useUtmParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [leadId, setLeadId] = useState(null);

  const [formData, setFormData] = useState({
    ...step1Defaults,
    ...step2Defaults,
    ...step3Defaults,
  });

  // ─── Sync URL on step change ────────────────────────────────────────────
  // ─── Sync URL on step change ────────────────────────────────────────────
  useEffect(() => {
    if (isComplete) {
      window.history.pushState({ step: 'complete' }, '', STEP_URLS.complete);
      return;
    }

    // On step 1, preserve any existing query params (UTMs etc.)
    // On subsequent steps they've already been captured so we can drop them
    const search = currentStep === 1 ? window.location.search : '';
    const url = `${STEP_URLS[currentStep]}${search}`;
    window.history.pushState({ step: currentStep }, '', url);
  }, [currentStep, isComplete]);

  // ─── Browser back/forward ───────────────────────────────────────────────
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.step && !isComplete) {
        setCurrentStep(event.state.step);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isComplete]);

  // ─── Step 1: Create lead, store leadId, advance ─────────────────────────
  const submitStep1 = useCallback(async (stepData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let id = leadId;

      if (leadId) {
        // Lead already exists — just update it
        const response = await fetch(`${API_URL}/api/leads/${leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...stepData, step: 1 }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to save, please try again.');
        }
      } else {
        // No lead yet — create it
        const response = await fetch(`${API_URL}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...stepData, ...utmParams }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to save, please try again.');
        }

        id = data.leadId;
        setLeadId(id);
      }

      setFormData((prev) => ({ ...prev, ...stepData }));
      setCurrentStep(2);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [leadId]);

  // ─── Steps 2 & 3: Update existing lead, advance ─────────────────────────
  const submitStep = useCallback(async (stepData, step) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${API_URL}/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...stepData, step }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save, please try again.');
      }

      setFormData((prev) => ({ ...prev, ...stepData }));

      if (step === 3) {
        setIsComplete(true);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [leadId]);

  // ─── Back navigation — no API call needed ───────────────────────────────
  const prevStep = useCallback(() => {
    setSubmitError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const progressPercent = Math.round((currentStep / TOTAL_STEPS) * 100);

  return {
    currentStep,
    formData,
    isSubmitting,
    submitError,
    isComplete,
    leadId,
    progressPercent,
    totalSteps: TOTAL_STEPS,
    submitStep1,
    submitStep,
    prevStep,
  };
}
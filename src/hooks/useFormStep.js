import { useState, useCallback, useEffect } from 'react';
import { useUtmParams } from './useUtmParams';
import {
  step1Defaults,
  step2Defaults,
  step3Defaults,
} from '../schemas/formSchemas';

function buildStepUrl(step, preserveExisting = false) {
  const params = preserveExisting
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();
  params.set('step', step);
  return `${window.location.pathname}?${params.toString()}`;
}

const TOTAL_STEPS = 3;
const API_URL = import.meta.env.VITE_API_URL || 'https://tn-homebuyers-lead-form.vercel.app';

export function useFormStep({ variant = 'full', fullFormUrl = '' } = {}) {
  const utmParams = useUtmParams();

  // Full form can be entered mid-flow from the short form redirect (?step=2)
  const urlParams = new URLSearchParams(window.location.search);
  const initialStep = parseInt(urlParams.get('step')) || 1;
  const initialLeadId = urlParams.get('leadId') || sessionStorage.getItem('thb_lead_id') || null;

  const storedStep1 = (() => {
    try {
      const stored = sessionStorage.getItem('thb_step1');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  })();

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [leadId, setLeadId] = useState(initialLeadId);

  const [formData, setFormData] = useState({
    ...step1Defaults,
    ...step2Defaults,
    ...step3Defaults,
    ...storedStep1,
  });

  // ─── Sync URL on step change (full form only) ───────────────────────────
  useEffect(() => {
    if (variant === 'short') return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (isComplete) {
      window.history.pushState({ step: 'complete' }, '', buildStepUrl('complete'));
      return;
    }

    const url = buildStepUrl(currentStep, currentStep === 1);
    window.history.pushState({ step: currentStep }, '', url);
  }, [currentStep, isComplete, variant]);

  // ─── Browser back/forward (full form only) ──────────────────────────────
  useEffect(() => {
    if (variant === 'short') return;

    const handlePopState = (event) => {
      if (event.state?.step && !isComplete) {
        setCurrentStep(event.state.step);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isComplete, variant]);

  // ─── Step 1: Create lead with address (LastName placeholder) ───────────
  const submitStep1 = useCallback(async (stepData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let id = leadId;

      if (!leadId) {
        const response = await fetch(`${API_URL}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...stepData, ...utmParams, sourceUrl: window.location.href }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to save, please try again.');
        }

        id = data.leadId;
        setLeadId(id);
      } else {
        // User went back and changed address — update existing lead
        const response = await fetch(`${API_URL}/api/leads/${leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...stepData, step: 1 }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to save, please try again.');
        }
      }

      setFormData((prev) => ({ ...prev, ...stepData }));

      if (variant === 'short') {
        sessionStorage.setItem('thb_step1', JSON.stringify(stepData));
        sessionStorage.setItem('thb_lead_id', id);
        const base = fullFormUrl.split('?')[0];
        window.location.href = `${base}?step=2&leadId=${id}`;
        return;
      }

      setCurrentStep(2);
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        setCurrentStep(2);
      } else {
        setSubmitError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [leadId, utmParams, variant, fullFormUrl]);

  // ─── Step 2: Update lead with real contact info ──────────────────────────
  const submitStep2 = useCallback(async (stepData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${API_URL}/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...stepData, step: 2 }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save, please try again.');
      }

      setFormData((prev) => ({ ...prev, ...stepData }));
      setCurrentStep(3);
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        setCurrentStep(3);
      } else {
        setSubmitError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [leadId]);

  // ─── Step 3: Update lead, complete ──────────────────────────────────────
  const submitStep3 = useCallback(async (stepData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${API_URL}/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...stepData, step: 3 }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save, please try again.');
      }

      setFormData((prev) => ({ ...prev, ...stepData }));
      setIsComplete(true);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [leadId]);

  // ─── Back navigation ─────────────────────────────────────────────────────
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
    progressPercent,
    totalSteps: TOTAL_STEPS,
    submitStep1,
    submitStep2,
    submitStep3,
    prevStep,
  };
}

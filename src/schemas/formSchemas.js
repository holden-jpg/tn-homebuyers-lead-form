import { z } from 'zod';

// ─── Step 1: Personal Details ───────────────────────────────────────────────

export const step1Schema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Please enter your full name')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),

  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d{3}-\d{3}-\d{4}$/, 'Please use format: 111-111-1111')
});

// ─── Step 2: Property Address ───────────────

export const step2Schema = z.object({
  addressLine1: z.string().min(1, 'Address Line 1 is required'),

  addressLine2: z.string().optional(),

  city: z.string().optional(),

  state: z.string().optional(),
  
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid zip code')
    .optional()
    .or(z.literal(''))
});

// ─── Step 3: Sale Intent ─────────────────────────────────────────────────────

export const step3Schema = z.object({
  timeToSell: z
    .string()
    .min(1, 'Please select a timeframe'),

  howDidYouHear: z
    .string()
    .optional(),

  additionalNotes: z
    .string()
    .max(500, 'Please keep notes under 500 characters')
    .optional()
});

// ─── Combined schema for final Salesforce submission ────────────────────────
// Merges all steps — used to validate the full payload before the API call

export const fullFormSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema);

// ─── TypeScript-style type exports (useful if you migrate to TS later) ───────

export const step1Defaults = {
  fullName: '',
  email: '',
  phone: ''
};

export const step2Defaults = {
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: ''
};

export const step3Defaults = {
  timeToSell: '',
  howDidYouHear: '',
  additionalNotes: ''
};

export const fullFormDefaults = {
  ...step1Defaults,
  ...step2Defaults,
  ...step3Defaults
};
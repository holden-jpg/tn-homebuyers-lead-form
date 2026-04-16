import { z } from 'zod';

// ─── Step 1: Property Address ────────────────────────────────────────────────

export const step1Schema = z.object({
  propertyAddress: z
    .string()
    .min(1, 'Property address is required'),
});

// ─── Step 2: Contact Info ────────────────────────────────────────────────────

export const step2Schema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Please enter your full name')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d{3}-\d{3}-\d{4}$/, 'Please use format: 111-111-1111'),
});

// ─── Step 3: Sale Intent ─────────────────────────────────────────────────────

export const step3Schema = z.object({
  timeToSell: z
    .string()
    .min(1, 'Please select a timeframe'),

  additionalNotes: z
    .string()
    .max(500, 'Please keep notes under 500 characters')
    .optional(),
});

// ─── Combined schema ─────────────────────────────────────────────────────────

export const fullFormSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema);

// ─── Defaults ────────────────────────────────────────────────────────────────

export const step1Defaults = {
  propertyAddress: '',
};

export const step2Defaults = {
  fullName: '',
  email: '',
  phone: '',
};

export const step3Defaults = {
  timeToSell: '',
  additionalNotes: '',
};

export const fullFormDefaults = {
  ...step1Defaults,
  ...step2Defaults,
  ...step3Defaults,
};

import { z } from 'zod';

export const UpdateOrganizationSchema = z.object({
  name: z.string().min(2).optional(),
  logo: z.string().url().optional(),
  timezone: z.string().optional(),
  currency: z.string().length(3).optional(),
  locale: z.string().optional(),
  settings: z.object({
    inventory: z.object({
      lowStockThreshold: z.number().min(0).optional(),
      autoReorderEnabled: z.boolean().optional(),
      barcodeFormat: z.string().optional(),
      enableExpiryTracking: z.boolean().optional(),
      enableBatchTracking: z.boolean().optional(),
    }).optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
      push: z.boolean().optional(),
      lowStockAlerts: z.boolean().optional(),
      orderUpdates: z.boolean().optional(),
    }).optional(),
  }).optional(),
});

export const AIProviderSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['openai', 'anthropic', 'google', 'custom']),
  apiKey: z.string().min(1),
  endpoint: z.string().url().optional(),
  model: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const CustomFieldSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['text', 'number', 'date', 'select', 'boolean']),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  defaultValue: z.any().optional(),
});

export type UpdateOrganizationInput = z.infer<typeof UpdateOrganizationSchema>;
export type AIProviderInput = z.infer<typeof AIProviderSchema>;
export type CustomFieldInput = z.infer<typeof CustomFieldSchema>;
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['org_admin', 'manager', 'user', 'viewer']),
  phoneNumber: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(['org_admin', 'manager', 'user', 'viewer']).optional(),
  phoneNumber: z.string().optional(),
  avatar: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
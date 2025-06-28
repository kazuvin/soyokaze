import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  avatar_url: z.string().url('Invalid URL format').nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  synced: z.boolean(),
  last_modified: z.string().datetime(),
});

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  avatar_url: z.string().url('Invalid URL format').nullable().optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  avatar_url: z.string().url('Invalid URL format').nullable().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUserData = z.infer<typeof CreateUserSchema>;
export type UpdateUserData = z.infer<typeof UpdateUserSchema>;
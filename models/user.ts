import { z } from 'zod';

// SQLiteから取得する生データ用のスキーマ
export const UserRawSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  avatar_url: z.string().nullable(),
  created_at: z.string(), // SQLiteのdatetime format
  updated_at: z.string(), // SQLiteのdatetime format
  synced: z.number().int().min(0).max(1), // SQLiteのboolean (0 or 1)
  last_modified: z.string(), // SQLiteのdatetime format
});

// アプリケーション用の変換済みスキーマ
export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  avatar_url: z.string().url('Invalid URL format').nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  synced: z.boolean(),
  last_modified: z.string(),
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

export type UserRaw = z.infer<typeof UserRawSchema>;
export type User = z.infer<typeof UserSchema>;
export type CreateUserData = z.infer<typeof CreateUserSchema>;
export type UpdateUserData = z.infer<typeof UpdateUserSchema>;
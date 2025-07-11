import { z } from "zod";
const User = z
  .object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    avatar_url: z.string().url().nullish(),
    bio: z.string().nullish(),
    created_at: z.string().datetime({ offset: true }),
    updated_at: z.string().datetime({ offset: true }),
    last_login: z.string().datetime({ offset: true }).nullish(),
    is_active: z.boolean().optional(),
  })
  .passthrough();
const Error = z
  .object({
    error: z.string(),
    message: z.string(),
    details: z.object({}).partial().passthrough().nullish(),
  })
  .passthrough();
const UpdateUserRequest = z
  .object({
    email: z.string().email(),
    name: z.string(),
    avatar_url: z.string().url().nullable(),
    bio: z.string().nullable(),
    is_active: z.boolean(),
  })
  .partial()
  .passthrough();
const CreateUserRequest = z
  .object({
    email: z.string().email(),
    name: z.string(),
    avatar_url: z.string().url().nullish(),
    bio: z.string().nullish(),
    is_active: z.boolean().optional().default(true),
  })
  .passthrough();

export const schemas = {
  User,
  Error,
  UpdateUserRequest,
  CreateUserRequest,
};
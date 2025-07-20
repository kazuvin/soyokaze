import { z } from 'zod'

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['admin', 'user']).default('user'),
})

export const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  status: z.enum(['draft', 'published']).default('draft'),
})

export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
})

export const IdParamSchema = z.object({
  id: z.coerce.number().min(1),
})

// Journal validators
export const DateStringSchema = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  'Date must be in YYYY-MM-DD format'
)

export const CreateJournalSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  date: DateStringSchema,
  authorId: z.number().int().positive(),
})

export const UpdateJournalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  date: DateStringSchema.optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
})

export const JournalListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  authorId: z.coerce.number().int().positive().optional(),
  date: DateStringSchema.optional(),
})
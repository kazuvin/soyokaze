import { z } from 'zod'
import { 
  CreateUserSchema, 
  CreatePostSchema, 
  PaginationSchema,
  CreateJournalSchema,
  UpdateJournalSchema,
  JournalListQuerySchema
} from './validators'
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { journals } from '../db/schema'

export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type CreatePostInput = z.infer<typeof CreatePostSchema>
export type PaginationQuery = z.infer<typeof PaginationSchema>

// Journal validation types
export type CreateJournalInput = z.infer<typeof CreateJournalSchema>
export type UpdateJournalInput = z.infer<typeof UpdateJournalSchema>
export type JournalListQuery = z.infer<typeof JournalListQuerySchema>

// Journal types using Drizzle ORM inference
export type Journal = InferSelectModel<typeof journals>
export type NewJournal = InferInsertModel<typeof journals>
export type JournalUpdate = Partial<Pick<Journal, 'title' | 'content' | 'date'>>

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    total: number
    hasNext: boolean
  }
}

export type ApiResponse<T = unknown> = {
  success: true
  data: T
} | {
  success: false
  error: string
}
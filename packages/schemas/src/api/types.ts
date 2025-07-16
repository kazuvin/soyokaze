import { z } from 'zod'
import { CreateUserSchema, CreatePostSchema, PaginationSchema } from './validators'

export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type CreatePostInput = z.infer<typeof CreatePostSchema>
export type PaginationQuery = z.infer<typeof PaginationSchema>

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
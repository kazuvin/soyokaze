import { drizzle } from 'drizzle-orm/d1'
import * as schema from '@soyokaze/schemas/db/schema'

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema })
}

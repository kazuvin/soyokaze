import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { eq, desc } from 'drizzle-orm'
import { createDb } from '../db'
import { users } from '@soyokaze/schemas/db/schema'
import { CreateUserSchema, PaginationSchema, IdParamSchema } from '@soyokaze/schemas/api/validators'
import { NotFoundError } from '@soyokaze/schemas/api/errors'

type Bindings = { DB: D1Database }
const app = new Hono<{ Bindings: Bindings }>()

// ユーザー一覧
app.get('/', zValidator('query', PaginationSchema), async (c) => {
  const db = createDb(c.env.DB)
  const { page, limit } = c.req.valid('query')
  
  const result = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset((page - 1) * limit)

  return c.json({ success: true, data: result })
})

// ユーザー作成
app.post('/', zValidator('json', CreateUserSchema), async (c) => {
  const db = createDb(c.env.DB)
  const input = c.req.valid('json')
  
  const [user] = await db
    .insert(users)
    .values(input)
    .returning()

  return c.json({ success: true, data: user }, 201)
})

// ユーザー詳細
app.get('/:id', zValidator('param', IdParamSchema), async (c) => {
  const db = createDb(c.env.DB)
  const { id } = c.req.valid('param')
  
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  if (result.length === 0) {
    throw new NotFoundError('User')
  }

  return c.json({ success: true, data: result[0] })
})

export default app
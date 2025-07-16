import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { eq, desc } from 'drizzle-orm'
import { createDb } from '../db'
import { posts, users } from '@soyokaze/schemas/db/schema'
import { CreatePostSchema, PaginationSchema, IdParamSchema } from '@soyokaze/schemas/api/validators'
import { NotFoundError } from '@soyokaze/schemas/api/errors'

type Bindings = { DB: D1Database }
const app = new Hono<{ Bindings: Bindings }>()

// 投稿一覧
app.get('/', zValidator('query', PaginationSchema), async (c) => {
  const db = createDb(c.env.DB)
  const { page, limit } = c.req.valid('query')
  
  const result = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      status: posts.status,
      createdAt: posts.createdAt,
      author: { id: users.id, name: users.name },
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset((page - 1) * limit)

  return c.json({ success: true, data: result })
})

// 投稿作成
app.post('/', zValidator('json', CreatePostSchema), async (c) => {
  const db = createDb(c.env.DB)
  const input = c.req.valid('json')
  
  const [post] = await db
    .insert(posts)
    .values({ ...input, authorId: 1 }) // TODO: 認証
    .returning()

  return c.json({ success: true, data: post }, 201)
})

// 投稿詳細
app.get('/:id', zValidator('param', IdParamSchema), async (c) => {
  const db = createDb(c.env.DB)
  const { id } = c.req.valid('param')
  
  const result = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      status: posts.status,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      author: { id: users.id, name: users.name },
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.id, id))
    .limit(1)

  if (result.length === 0) {
    throw new NotFoundError('Post')
  }

  return c.json({ success: true, data: result[0] })
})

export default app
# Schema & API 設計書 - Core構成

## ディレクトリ構成

```
packages/
├── schema/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts      # テーブル定義
│   │   │   ├── types.ts       # DB型定義
│   │   │   └── index.ts
│   │   ├── api/
│   │   │   ├── validators.ts  # Zod validators
│   │   │   ├── types.ts       # API型定義
│   │   │   └── errors.ts      # エラー定義
│   │   └── index.ts
│   └── package.json
└── api/
    ├── src/
    │   ├── routes/            # APIルート
    │   ├── db/index.ts        # DB接続
    │   └── index.ts           # メインアプリ
    ├── wrangler.toml
    └── package.json
```

## Schema設計

### DB Schema (`packages/schema/src/db/schema.ts`)

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'user'] }).default('user'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id').references(() => users.id),
  status: text('status', { enum: ['draft', 'published'] }).default('draft'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})
```

### DB Types (`packages/schema/src/db/types.ts`)

```typescript
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { users, posts } from './schema'

export type User = InferSelectModel<typeof users>
export type Post = InferSelectModel<typeof posts>
export type NewUser = InferInsertModel<typeof users>
export type NewPost = InferInsertModel<typeof posts>

export type PostWithAuthor = Post & {
  author: Pick<User, 'id' | 'name'>
}
```

### API Validators (`packages/schema/src/api/validators.ts`)

```typescript
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
```

### API Types (`packages/schema/src/api/types.ts`)

```typescript
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
```

### Errors (`packages/schema/src/api/errors.ts`)

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400)
  }
}
```

## API設計

### DB接続 (`packages/api/src/db/index.ts`)

```typescript
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '@repo/schema/db/schema'

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema })
}

export { schema }
export * from '@repo/schema/db/types'
```

### ルート例 (`packages/api/src/routes/posts.ts`)

```typescript
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { eq, desc } from 'drizzle-orm'
import { createDb } from '../db'
import { posts, users } from '@repo/schema/db/schema'
import { CreatePostSchema, PaginationSchema, IdParamSchema } from '@repo/schema/api/validators'
import { NotFoundError } from '@repo/schema/api/errors'

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

export default app
```

### メインアプリ (`packages/api/src/index.ts`)

```typescript
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import posts from './routes/posts'

type Bindings = { DB: D1Database }
const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())
app.route('/api/posts', posts)

app.onError((err, c) => {
  console.error(err)
  return c.json({ success: false, error: err.message }, 500)
})

export default app
export type ApiType = typeof app
```

## 設定ファイル

### wrangler.toml

```toml
name = "api-server"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "api-db"
database_id = "your-database-id"
```

### package.json (schema)

```json
{
  "name": "@repo/schema",
  "dependencies": {
    "drizzle-orm": "^0.33.0",
    "zod": "^3.22.0"
  }
}
```

### package.json (api)

```json
{
  "name": "@repo/api",
  "dependencies": {
    "@repo/schema": "workspace:*",
    "hono": "^4.0.0",
    "@hono/zod-validator": "^0.2.0",
    "drizzle-orm": "^0.33.0"
  }
}
```

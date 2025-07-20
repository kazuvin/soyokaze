import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { users, posts } from './schema'

export type User = InferSelectModel<typeof users>
export type Post = InferSelectModel<typeof posts>
export type NewUser = InferInsertModel<typeof users>
export type NewPost = InferInsertModel<typeof posts>

export type PostWithAuthor = Post & {
  author: Pick<User, 'id' | 'name'>
}
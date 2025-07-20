import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { eq, and, desc, count } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

import { db } from '../db'
import { journals, users } from '@repo/schemas/db/schema'
import {
  CreateJournalSchema,
  UpdateJournalSchema,
  JournalListQuerySchema,
  IdParamSchema,
} from '@repo/schemas/api/validators'
import { AppError, NotFoundError, ValidationError } from '@repo/schemas/api/errors'
import type { Bindings } from '../types'

const app = new Hono<{ Bindings: Bindings }>()

// GET /journals - 一覧取得
app.get('/', zValidator('query', JournalListQuerySchema), async (c) => {
  try {
    const query = c.req.valid('query')
    const { page, limit, authorId, date } = query

    // WHERE条件を動的に構築
    const whereConditions = []
    if (authorId) {
      whereConditions.push(eq(journals.authorId, authorId))
    }
    if (date) {
      whereConditions.push(eq(journals.date, date))
    }

    // ジャーナル一覧取得
    const journalList = await db
      .select()
      .from(journals)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(journals.createdAt))
      .limit(limit)
      .offset((page - 1) * limit)

    // 総件数取得
    const [{ count: total }] = await db
      .select({ count: count() })
      .from(journals)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    return c.json({
      success: true,
      data: {
        journals: journalList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Error fetching journals:', error)
    throw new AppError('Failed to fetch journals', 'FETCH_ERROR', 500)
  }
})

// GET /journals/:id - 詳細取得
app.get('/:id', zValidator('param', IdParamSchema), async (c) => {
  try {
    const { id } = c.req.valid('param')

    const [journal] = await db
      .select()
      .from(journals)
      .where(eq(journals.id, id))
      .limit(1)

    if (!journal) {
      throw new NotFoundError('Journal')
    }

    return c.json({
      success: true,
      data: journal,
    })
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    console.error('Error fetching journal:', error)
    throw new AppError('Failed to fetch journal', 'FETCH_ERROR', 500)
  }
})

// POST /journals - 作成
app.post('/', zValidator('json', CreateJournalSchema), async (c) => {
  try {
    const journalData = c.req.valid('json')

    // 作成者の存在確認
    const [author] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, journalData.authorId))
      .limit(1)

    if (!author) {
      throw new ValidationError('Author does not exist')
    }

    // ジャーナル作成
    const [newJournal] = await db
      .insert(journals)
      .values({
        title: journalData.title,
        content: journalData.content,
        date: journalData.date,
        authorId: journalData.authorId,
      })
      .returning()

    return c.json({
      success: true,
      data: newJournal,
    }, 201)
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    console.error('Error creating journal:', error)
    throw new AppError('Failed to create journal', 'CREATE_ERROR', 500)
  }
})

// PUT /journals/:id - 更新
app.put('/:id', 
  zValidator('param', IdParamSchema),
  zValidator('json', UpdateJournalSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param')
      const updateData = c.req.valid('json')

      // ジャーナルの存在確認
      const [existingJournal] = await db
        .select()
        .from(journals)
        .where(eq(journals.id, id))
        .limit(1)

      if (!existingJournal) {
        throw new NotFoundError('Journal')
      }

      // 更新データに updatedAt を追加
      const updateValues = {
        ...updateData,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      }

      // ジャーナル更新
      const [updatedJournal] = await db
        .update(journals)
        .set(updateValues)
        .where(eq(journals.id, id))
        .returning()

      return c.json({
        success: true,
        data: updatedJournal,
      })
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      console.error('Error updating journal:', error)
      throw new AppError('Failed to update journal', 'UPDATE_ERROR', 500)
    }
  }
)

// DELETE /journals/:id - 削除
app.delete('/:id', zValidator('param', IdParamSchema), async (c) => {
  try {
    const { id } = c.req.valid('param')

    // ジャーナルの存在確認
    const [existingJournal] = await db
      .select()
      .from(journals)
      .where(eq(journals.id, id))
      .limit(1)

    if (!existingJournal) {
      throw new NotFoundError('Journal')
    }

    // ジャーナル削除
    await db
      .delete(journals)
      .where(eq(journals.id, id))

    return c.json({
      success: true,
      data: {
        message: 'Journal deleted successfully',
        deletedId: id,
      },
    })
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    console.error('Error deleting journal:', error)
    throw new AppError('Failed to delete journal', 'DELETE_ERROR', 500)
  }
})

export default app
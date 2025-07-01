import { z } from 'zod';

// SQLiteから取得する生データ用のスキーマ
export const JournalEntryRawSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().nullable(),
  content: z.string().min(1, 'Content is required'),
  entry_date: z.string(), // YYYY-MM-DD format
  created_at: z.string(), // SQLiteのdatetime format
  updated_at: z.string(), // SQLiteのdatetime format
  synced: z.number().int().min(0).max(1), // SQLiteのboolean (0 or 1)
  last_modified: z.string(), // SQLiteのdatetime format
});

// アプリケーション用の変換済みスキーマ
export const JournalEntrySchema = z.object({
  id: z.number().int().positive(),
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  entry_date: z.string().date(),
  created_at: z.string(),
  updated_at: z.string(),
  synced: z.boolean(),
  last_modified: z.string(),
});

export const CreateJournalEntrySchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  entry_date: z.string().date(),
});

export const UpdateJournalEntrySchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required').optional(),
  entry_date: z.string().date().optional(),
});

export type JournalEntryRaw = z.infer<typeof JournalEntryRawSchema>;
export type JournalEntry = z.infer<typeof JournalEntrySchema>;
export type CreateJournalEntryData = z.infer<typeof CreateJournalEntrySchema>;
export type UpdateJournalEntryData = z.infer<typeof UpdateJournalEntrySchema>;
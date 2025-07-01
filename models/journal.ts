import { z } from 'zod';

export const JournalEntrySchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, 'タイトルは必須です'),
  content: z.string().min(1, '内容は必須です'),
  images: z.array(z.string().url()).optional(),
  date: z.date(),
  created_at: z.date(),
  updated_at: z.date(),
  synced: z.boolean().default(false),
  last_modified: z.date(),
});

export const CreateJournalEntrySchema = JournalEntrySchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  synced: true,
  last_modified: true,
});

export const UpdateJournalEntrySchema = CreateJournalEntrySchema.partial();

export type JournalEntry = z.infer<typeof JournalEntrySchema>;
export type CreateJournalEntry = z.infer<typeof CreateJournalEntrySchema>;
export type UpdateJournalEntry = z.infer<typeof UpdateJournalEntrySchema>;
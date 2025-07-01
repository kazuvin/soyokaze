import { z } from 'zod';

export const JournalEntrySchema = z.object({
  id: z.number().int().positive(),
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  entry_date: z.string().date(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  synced: z.boolean(),
  last_modified: z.string().datetime(),
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

export type JournalEntry = z.infer<typeof JournalEntrySchema>;
export type CreateJournalEntryData = z.infer<typeof CreateJournalEntrySchema>;
export type UpdateJournalEntryData = z.infer<typeof UpdateJournalEntrySchema>;
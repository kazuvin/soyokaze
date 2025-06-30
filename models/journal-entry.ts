import { z } from 'zod';

export const JournalEntrySchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  images: z.array(z.string()).max(4, 'Maximum 4 images allowed').optional(),
  ai_feedback_type: z.string().optional(),
  date: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  synced: z.boolean(),
  last_modified: z.string().datetime(),
});

export const CreateJournalEntrySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  images: z.array(z.string()).max(4, 'Maximum 4 images allowed').optional(),
  ai_feedback_type: z.string().optional(),
  date: z.string().datetime(),
});

export const UpdateJournalEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  images: z.array(z.string()).max(4, 'Maximum 4 images allowed').optional(),
  ai_feedback_type: z.string().optional(),
  date: z.string().datetime().optional(),
});

export type JournalEntry = z.infer<typeof JournalEntrySchema>;
export type CreateJournalEntryData = z.infer<typeof CreateJournalEntrySchema>;
export type UpdateJournalEntryData = z.infer<typeof UpdateJournalEntrySchema>;
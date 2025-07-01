import { executeQuery, fetchQuery } from '@/database/query';
import { CreateJournalEntrySchema, UpdateJournalEntrySchema, JournalEntrySchema } from '@/models/journal';
import type { JournalEntry, CreateJournalEntryData, UpdateJournalEntryData } from '@/models/journal';
import type { DatabaseError } from '@/database/query';

export async function createJournalEntry(entryData: CreateJournalEntryData): Promise<JournalEntry> {
  const validatedData = CreateJournalEntrySchema.parse(entryData);
  
  const query = `
    INSERT INTO journal_entries (title, content, entry_date, last_modified)
    VALUES (?, ?, ?, datetime('now'))
  `;
  
  const result = await executeQuery<{ insertId: number }>(
    query,
    [validatedData.title || null, validatedData.content, validatedData.entry_date]
  );

  return await getJournalEntry(result.insertId);
}

export async function getJournalEntry(id: number): Promise<JournalEntry> {
  const query = 'SELECT * FROM journal_entries WHERE id = ?';
  const entries = await fetchQuery<JournalEntry>(query, [id]);
  
  if (entries.length === 0) {
    const error: DatabaseError = {
      message: `Journal entry with id ${id} not found`,
      code: 'JOURNAL_ENTRY_NOT_FOUND',
    };
    throw error;
  }

  return JournalEntrySchema.parse(entries[0]);
}

export async function getAllJournalEntries(): Promise<JournalEntry[]> {
  const query = 'SELECT * FROM journal_entries ORDER BY entry_date DESC, created_at DESC';
  const entries = await fetchQuery<JournalEntry>(query);
  
  return entries.map(entry => JournalEntrySchema.parse(entry));
}

export async function getJournalEntriesByDate(date: string): Promise<JournalEntry[]> {
  const query = 'SELECT * FROM journal_entries WHERE entry_date = ? ORDER BY created_at DESC';
  const entries = await fetchQuery<JournalEntry>(query, [date]);
  
  return entries.map(entry => JournalEntrySchema.parse(entry));
}

export async function getJournalEntriesByDateRange(startDate: string, endDate: string): Promise<JournalEntry[]> {
  const query = `
    SELECT * FROM journal_entries 
    WHERE entry_date >= ? AND entry_date <= ? 
    ORDER BY entry_date DESC, created_at DESC
  `;
  const entries = await fetchQuery<JournalEntry>(query, [startDate, endDate]);
  
  return entries.map(entry => JournalEntrySchema.parse(entry));
}

export async function updateJournalEntry(id: number, entryData: UpdateJournalEntryData): Promise<JournalEntry> {
  const validatedData = UpdateJournalEntrySchema.parse(entryData);
  
  const updateFields = Object.keys(validatedData).filter(
    key => validatedData[key as keyof UpdateJournalEntryData] !== undefined
  );
  
  if (updateFields.length === 0) {
    return await getJournalEntry(id);
  }

  const setClause = updateFields.map(field => `${field} = ?`).join(', ');
  const values = updateFields.map(field => validatedData[field as keyof UpdateJournalEntryData]);
  
  const query = `
    UPDATE journal_entries 
    SET ${setClause}, updated_at = datetime('now'), last_modified = datetime('now'), synced = 0
    WHERE id = ?
  `;
  
  await executeQuery(query, [...values, id]);
  return await getJournalEntry(id);
}

export async function deleteJournalEntry(id: number): Promise<void> {
  const query = 'DELETE FROM journal_entries WHERE id = ?';
  const result = await executeQuery<{ changes: number }>(query, [id]);
  
  if (result.changes === 0) {
    const error: DatabaseError = {
      message: `Journal entry with id ${id} not found`,
      code: 'JOURNAL_ENTRY_NOT_FOUND',
    };
    throw error;
  }
}

export async function getJournalEntriesNeedingSync(): Promise<JournalEntry[]> {
  const query = 'SELECT * FROM journal_entries WHERE synced = 0 ORDER BY last_modified ASC';
  const entries = await fetchQuery<JournalEntry>(query);
  
  return entries.map(entry => JournalEntrySchema.parse(entry));
}

export async function markJournalEntryAsSynced(id: number): Promise<void> {
  const query = 'UPDATE journal_entries SET synced = 1 WHERE id = ?';
  await executeQuery(query, [id]);
}

export async function searchJournalEntries(searchTerm: string): Promise<JournalEntry[]> {
  const query = `
    SELECT * FROM journal_entries 
    WHERE content LIKE ? OR title LIKE ?
    ORDER BY entry_date DESC, created_at DESC
  `;
  const likePattern = `%${searchTerm}%`;
  const entries = await fetchQuery<JournalEntry>(query, [likePattern, likePattern]);
  
  return entries.map(entry => JournalEntrySchema.parse(entry));
}
import { executeQuery, fetchQuery } from '@/database/query';
import { CreateJournalEntrySchema, UpdateJournalEntrySchema, JournalEntrySchema } from '@/models/journal';
import type { JournalEntry, CreateJournalEntry, UpdateJournalEntry } from '@/models/journal';
import type { DatabaseError } from '@/database/query';

export async function createJournalEntry(entryData: CreateJournalEntry): Promise<JournalEntry> {
  const validatedData = CreateJournalEntrySchema.parse(entryData);
  
  const query = `
    INSERT INTO journal_entries (title, content, images, date, last_modified)
    VALUES (?, ?, ?, ?, datetime('now'))
  `;
  
  const result = await executeQuery<{ insertId: number }>(
    query,
    [
      validatedData.title, 
      validatedData.content, 
      validatedData.images ? JSON.stringify(validatedData.images) : null,
      validatedData.date.toISOString().split('T')[0]
    ]
  );

  return await getJournalEntry(result.insertId);
}

export async function getJournalEntry(id: number): Promise<JournalEntry> {
  const query = 'SELECT * FROM journal_entries WHERE id = ?';
  const entries = await fetchQuery<any>(query, [id]);
  
  if (entries.length === 0) {
    const error: DatabaseError = {
      message: `Journal entry with id ${id} not found`,
      code: 'JOURNAL_ENTRY_NOT_FOUND',
    };
    throw error;
  }

  const entry = entries[0];
  const parsedEntry = {
    ...entry,
    images: entry.images ? JSON.parse(entry.images) : undefined,
    date: new Date(entry.date),
    created_at: new Date(entry.created_at),
    updated_at: new Date(entry.updated_at),
    last_modified: new Date(entry.last_modified),
  };

  return JournalEntrySchema.parse(parsedEntry);
}

export async function getAllJournalEntries(): Promise<JournalEntry[]> {
  const query = 'SELECT * FROM journal_entries ORDER BY date DESC, created_at DESC';
  const entries = await fetchQuery<any>(query);
  
  return entries.map(entry => {
    const parsedEntry = {
      ...entry,
      images: entry.images ? JSON.parse(entry.images) : undefined,
      date: new Date(entry.date),
      created_at: new Date(entry.created_at),
      updated_at: new Date(entry.updated_at),
      last_modified: new Date(entry.last_modified),
    };
    return JournalEntrySchema.parse(parsedEntry);
  });
}

export async function getJournalEntriesByDate(date: Date): Promise<JournalEntry[]> {
  const dateString = date.toISOString().split('T')[0];
  const query = 'SELECT * FROM journal_entries WHERE date = ? ORDER BY created_at DESC';
  const entries = await fetchQuery<any>(query, [dateString]);
  
  return entries.map(entry => {
    const parsedEntry = {
      ...entry,
      images: entry.images ? JSON.parse(entry.images) : undefined,
      date: new Date(entry.date),
      created_at: new Date(entry.created_at),
      updated_at: new Date(entry.updated_at),
      last_modified: new Date(entry.last_modified),
    };
    return JournalEntrySchema.parse(parsedEntry);
  });
}

export async function getJournalEntriesByDateRange(startDate: Date, endDate: Date): Promise<JournalEntry[]> {
  const startDateString = startDate.toISOString().split('T')[0];
  const endDateString = endDate.toISOString().split('T')[0];
  
  const query = `
    SELECT * FROM journal_entries 
    WHERE date BETWEEN ? AND ? 
    ORDER BY date DESC, created_at DESC
  `;
  
  const entries = await fetchQuery<any>(query, [startDateString, endDateString]);
  
  return entries.map(entry => {
    const parsedEntry = {
      ...entry,
      images: entry.images ? JSON.parse(entry.images) : undefined,
      date: new Date(entry.date),
      created_at: new Date(entry.created_at),
      updated_at: new Date(entry.updated_at),
      last_modified: new Date(entry.last_modified),
    };
    return JournalEntrySchema.parse(parsedEntry);
  });
}

export async function updateJournalEntry(id: number, entryData: UpdateJournalEntry): Promise<JournalEntry> {
  const validatedData = UpdateJournalEntrySchema.parse(entryData);
  
  const updateFields = Object.keys(validatedData).filter(
    key => validatedData[key as keyof UpdateJournalEntry] !== undefined
  );
  
  if (updateFields.length === 0) {
    return await getJournalEntry(id);
  }

  const setClause = updateFields.map(field => {
    if (field === 'images') return 'images = ?';
    if (field === 'date') return 'date = ?';
    return `${field} = ?`;
  }).join(', ');
  
  const values = updateFields.map(field => {
    const value = validatedData[field as keyof UpdateJournalEntry];
    if (field === 'images' && value) {
      return JSON.stringify(value);
    }
    if (field === 'date' && value) {
      return (value as Date).toISOString().split('T')[0];
    }
    return value;
  });
  
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
  const entries = await fetchQuery<any>(query);
  
  return entries.map(entry => {
    const parsedEntry = {
      ...entry,
      images: entry.images ? JSON.parse(entry.images) : undefined,
      date: new Date(entry.date),
      created_at: new Date(entry.created_at),
      updated_at: new Date(entry.updated_at),
      last_modified: new Date(entry.last_modified),
    };
    return JournalEntrySchema.parse(parsedEntry);
  });
}

export async function markJournalEntryAsSynced(id: number): Promise<void> {
  const query = 'UPDATE journal_entries SET synced = 1 WHERE id = ?';
  await executeQuery(query, [id]);
}
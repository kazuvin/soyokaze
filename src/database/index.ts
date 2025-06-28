import * as SQLite from 'expo-sqlite';
import { SCHEMA_STATEMENTS } from './schema';
import type { DatabaseError } from './query';

const DATABASE_NAME = 'soyokaze.db';

let database: SQLite.SQLiteDatabase | null = null;

export async function initializeDatabase(): Promise<SQLite.SQLiteDatabase> {
  try {
    if (database) {
      return database;
    }

    database = await SQLite.openDatabaseAsync(DATABASE_NAME);
    
    await database.execAsync('PRAGMA journal_mode = WAL;');
    await database.execAsync('PRAGMA foreign_keys = ON;');

    for (const statement of SCHEMA_STATEMENTS) {
      await database.execAsync(statement);
    }

    console.log('Database initialized successfully');
    return database;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    const dbError: DatabaseError = {
      message: error instanceof Error ? error.message : 'Failed to initialize database',
      code: 'DATABASE_INIT_ERROR',
    };
    throw dbError;
  }
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!database) {
    return await initializeDatabase();
  }
  return database;
}

export async function closeDatabase(): Promise<void> {
  if (database) {
    await database.closeAsync();
    database = null;
    console.log('Database connection closed');
  }
}
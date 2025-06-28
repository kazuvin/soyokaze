import { getDatabase } from './index';

export type DatabaseError = {
  message: string;
  code?: string;
};

export async function executeQuery<T>(
  query: string,
  params: any[] = []
): Promise<T> {
  try {
    const db = await getDatabase();
    return await db.runAsync(query, params) as T;
  } catch (error) {
    console.error('Database query error:', error);
    const dbError: DatabaseError = {
      message: error instanceof Error ? error.message : 'Database query failed',
      code: 'QUERY_ERROR',
    };
    throw dbError;
  }
}

export async function fetchQuery<T>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const db = await getDatabase();
    return await db.getAllAsync(query, params) as T[];
  } catch (error) {
    console.error('Database fetch error:', error);
    const dbError: DatabaseError = {
      message: error instanceof Error ? error.message : 'Database fetch failed',
      code: 'FETCH_ERROR',
    };
    throw dbError;
  }
}
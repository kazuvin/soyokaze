import { getDatabase } from '@/src/database';
import { CreateUserSchema, UpdateUserSchema, UserSchema } from '@/src/models/user';
import type { User, CreateUserData, UpdateUserData } from '@/src/models/user';

export type DatabaseError = {
  message: string;
  code?: string;
};

export class UserService {
  private static async executeQuery<T>(
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

  private static async fetchQuery<T>(
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

  static async createUser(userData: CreateUserData): Promise<User> {
    const validatedData = CreateUserSchema.parse(userData);
    
    const query = `
      INSERT INTO users (name, email, avatar_url, last_modified)
      VALUES (?, ?, ?, datetime('now'))
    `;
    
    const result = await this.executeQuery<{ insertId: number }>(
      query,
      [validatedData.name, validatedData.email, validatedData.avatar_url || null]
    );

    return await this.getUser(result.insertId);
  }

  static async getUser(id: number): Promise<User> {
    const query = 'SELECT * FROM users WHERE id = ?';
    const users = await this.fetchQuery<User>(query, [id]);
    
    if (users.length === 0) {
      const error: DatabaseError = {
        message: `User with id ${id} not found`,
        code: 'USER_NOT_FOUND',
      };
      throw error;
    }

    return UserSchema.parse(users[0]);
  }

  static async getAllUsers(): Promise<User[]> {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const users = await this.fetchQuery<User>(query);
    
    return users.map(user => UserSchema.parse(user));
  }

  static async updateUser(id: number, userData: UpdateUserData): Promise<User> {
    const validatedData = UpdateUserSchema.parse(userData);
    
    const updateFields = Object.keys(validatedData).filter(
      key => validatedData[key as keyof UpdateUserData] !== undefined
    );
    
    if (updateFields.length === 0) {
      return await this.getUser(id);
    }

    const setClause = updateFields.map(field => `${field} = ?`).join(', ');
    const values = updateFields.map(field => validatedData[field as keyof UpdateUserData]);
    
    const query = `
      UPDATE users 
      SET ${setClause}, updated_at = datetime('now'), last_modified = datetime('now'), synced = 0
      WHERE id = ?
    `;
    
    await this.executeQuery(query, [...values, id]);
    return await this.getUser(id);
  }

  static async deleteUser(id: number): Promise<void> {
    const query = 'DELETE FROM users WHERE id = ?';
    const result = await this.executeQuery<{ changes: number }>(query, [id]);
    
    if (result.changes === 0) {
      const error: DatabaseError = {
        message: `User with id ${id} not found`,
        code: 'USER_NOT_FOUND',
      };
      throw error;
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = ?';
    const users = await this.fetchQuery<User>(query, [email]);
    
    if (users.length === 0) {
      return null;
    }

    return UserSchema.parse(users[0]);
  }

  static async getUsersNeedingSync(): Promise<User[]> {
    const query = 'SELECT * FROM users WHERE synced = 0 ORDER BY last_modified ASC';
    const users = await this.fetchQuery<User>(query);
    
    return users.map(user => UserSchema.parse(user));
  }

  static async markUserAsSynced(id: number): Promise<void> {
    const query = 'UPDATE users SET synced = 1 WHERE id = ?';
    await this.executeQuery(query, [id]);
  }
}
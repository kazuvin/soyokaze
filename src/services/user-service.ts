import { executeQuery, fetchQuery } from '@/src/database/query';
import { CreateUserSchema, UpdateUserSchema, UserSchema } from '@/src/models/user';
import type { User, CreateUserData, UpdateUserData } from '@/src/models/user';
import type { DatabaseError } from '@/src/database/query';

export async function createUser(userData: CreateUserData): Promise<User> {
  const validatedData = CreateUserSchema.parse(userData);
  
  const query = `
    INSERT INTO users (name, email, avatar_url, last_modified)
    VALUES (?, ?, ?, datetime('now'))
  `;
  
  const result = await executeQuery<{ insertId: number }>(
    query,
    [validatedData.name, validatedData.email, validatedData.avatar_url || null]
  );

  return await getUser(result.insertId);
}

export async function getUser(id: number): Promise<User> {
  const query = 'SELECT * FROM users WHERE id = ?';
  const users = await fetchQuery<User>(query, [id]);
  
  if (users.length === 0) {
    const error: DatabaseError = {
      message: `User with id ${id} not found`,
      code: 'USER_NOT_FOUND',
    };
    throw error;
  }

  return UserSchema.parse(users[0]);
}

export async function getAllUsers(): Promise<User[]> {
  const query = 'SELECT * FROM users ORDER BY created_at DESC';
  const users = await fetchQuery<User>(query);
  
  return users.map(user => UserSchema.parse(user));
}

export async function updateUser(id: number, userData: UpdateUserData): Promise<User> {
  const validatedData = UpdateUserSchema.parse(userData);
  
  const updateFields = Object.keys(validatedData).filter(
    key => validatedData[key as keyof UpdateUserData] !== undefined
  );
  
  if (updateFields.length === 0) {
    return await getUser(id);
  }

  const setClause = updateFields.map(field => `${field} = ?`).join(', ');
  const values = updateFields.map(field => validatedData[field as keyof UpdateUserData]);
  
  const query = `
    UPDATE users 
    SET ${setClause}, updated_at = datetime('now'), last_modified = datetime('now'), synced = 0
    WHERE id = ?
  `;
  
  await executeQuery(query, [...values, id]);
  return await getUser(id);
}

export async function deleteUser(id: number): Promise<void> {
  const query = 'DELETE FROM users WHERE id = ?';
  const result = await executeQuery<{ changes: number }>(query, [id]);
  
  if (result.changes === 0) {
    const error: DatabaseError = {
      message: `User with id ${id} not found`,
      code: 'USER_NOT_FOUND',
    };
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const query = 'SELECT * FROM users WHERE email = ?';
  const users = await fetchQuery<User>(query, [email]);
  
  if (users.length === 0) {
    return null;
  }

  return UserSchema.parse(users[0]);
}

export async function getUsersNeedingSync(): Promise<User[]> {
  const query = 'SELECT * FROM users WHERE synced = 0 ORDER BY last_modified ASC';
  const users = await fetchQuery<User>(query);
  
  return users.map(user => UserSchema.parse(user));
}

export async function markUserAsSynced(id: number): Promise<void> {
  const query = 'UPDATE users SET synced = 1 WHERE id = ?';
  await executeQuery(query, [id]);
}
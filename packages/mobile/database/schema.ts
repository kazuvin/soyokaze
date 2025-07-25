export const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    synced BOOLEAN DEFAULT 0,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

export const CREATE_USERS_EMAIL_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`;

export const CREATE_USERS_SYNCED_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_users_synced ON users(synced);
`;

export const SCHEMA_STATEMENTS = [
  CREATE_USERS_TABLE,
  CREATE_USERS_EMAIL_INDEX,
  CREATE_USERS_SYNCED_INDEX,
] as const;
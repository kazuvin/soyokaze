import type { SQLiteDatabase } from 'expo-sqlite';

export type Migration = {
  version: number;
  name: string;
  up: string[];
  down?: string[];
};

export const migrations: Migration[] = [
  {
    version: 1,
    name: 'initial_schema',
    up: [
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        avatar_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        synced BOOLEAN DEFAULT 0,
        last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
      `CREATE INDEX IF NOT EXISTS idx_users_synced ON users(synced)`,
      `CREATE TABLE IF NOT EXISTS journal_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT NOT NULL,
        entry_date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        synced BOOLEAN DEFAULT 0,
        last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE INDEX IF NOT EXISTS idx_journal_entries_entry_date ON journal_entries(entry_date)`,
      `CREATE INDEX IF NOT EXISTS idx_journal_entries_synced ON journal_entries(synced)`,
    ],
  },
  {
    version: 2,
    name: 'add_images_to_journal_entries',
    up: [
      `ALTER TABLE journal_entries ADD COLUMN images TEXT`,
    ],
    down: [
      // SQLiteはALTER TABLE DROP COLUMNをサポートしていないため、テーブル再作成が必要
      `CREATE TABLE journal_entries_backup AS SELECT id, title, content, entry_date, created_at, updated_at, synced, last_modified FROM journal_entries`,
      `DROP TABLE journal_entries`,
      `CREATE TABLE journal_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT NOT NULL,
        entry_date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        synced BOOLEAN DEFAULT 0,
        last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `INSERT INTO journal_entries (id, title, content, entry_date, created_at, updated_at, synced, last_modified) SELECT id, title, content, entry_date, created_at, updated_at, synced, last_modified FROM journal_entries_backup`,
      `DROP TABLE journal_entries_backup`,
      `CREATE INDEX IF NOT EXISTS idx_journal_entries_entry_date ON journal_entries(entry_date)`,
      `CREATE INDEX IF NOT EXISTS idx_journal_entries_synced ON journal_entries(synced)`,
    ],
  },
];

export async function getCurrentVersion(db: SQLiteDatabase): Promise<number> {
  try {
    const result = await db.getAllAsync(
      'SELECT name FROM sqlite_master WHERE type="table" AND name="schema_migrations"'
    );
    
    if (result.length === 0) {
      // schema_migrationsテーブルが存在しない場合、バージョン0と判断
      return 0;
    }
    
    const versionResult = await db.getAllAsync(
      'SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1'
    );
    
    return versionResult.length > 0 ? (versionResult[0] as any).version : 0;
  } catch (error) {
    console.error('Error getting current version:', error);
    return 0;
  }
}

export async function setVersion(db: SQLiteDatabase, version: number): Promise<void> {
  // schema_migrationsテーブルを作成
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // バージョンを記録
  await db.runAsync(
    'INSERT OR REPLACE INTO schema_migrations (version) VALUES (?)',
    [version]
  );
}

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  const currentVersion = await getCurrentVersion(db);
  console.log(`Current database version: ${currentVersion}`);
  
  const pendingMigrations = migrations.filter(m => m.version > currentVersion);
  
  if (pendingMigrations.length === 0) {
    console.log('No pending migrations');
    return;
  }
  
  console.log(`Running ${pendingMigrations.length} migrations...`);
  
  for (const migration of pendingMigrations) {
    console.log(`Applying migration ${migration.version}: ${migration.name}`);
    
    try {
      await db.execAsync('BEGIN TRANSACTION');
      
      for (const statement of migration.up) {
        await db.execAsync(statement);
      }
      
      await setVersion(db, migration.version);
      await db.execAsync('COMMIT');
      
      console.log(`Migration ${migration.version} applied successfully`);
    } catch (error) {
      await db.execAsync('ROLLBACK');
      console.error(`Migration ${migration.version} failed:`, error);
      throw error;
    }
  }
  
  console.log('All migrations completed successfully');
}
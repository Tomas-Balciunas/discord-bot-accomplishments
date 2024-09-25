import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely';
import SQLite from 'better-sqlite3';
import type { DB } from './types';

export function makeDb(url: string) {
  if (!url) {
    throw new Error('Provide DATABASE_URL in your environment variables.');
  }

  const database = new SQLite(url);
  const dialect = new SqliteDialect({ database });

  const db = new Kysely<DB>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });

  return db;
}

export type Database = Kysely<DB>;
export * from './types';

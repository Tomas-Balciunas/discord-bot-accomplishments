import { Database } from '@/database';

export const createFor = (db: Database, table: string) => (obj: object) =>
  db
    .insertInto(table as any)
    .values(obj as any)
    .returningAll()
    .execute();

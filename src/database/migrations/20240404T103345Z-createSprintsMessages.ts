import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>): Promise<void> {
  await db.schema
    .createTable('sprints')
    .addColumn('id', 'integer', (col) => col.primaryKey().notNull())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('full_title', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('messages')
    .addColumn('id', 'integer', (col) => col.primaryKey().notNull())
    .addColumn('template_id', 'integer', (col) =>
      col.notNull()
    )
    .addColumn('sprint_id', 'integer', (col) =>
      col.notNull()
    )
    .addColumn('gif', 'text', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>): Promise<void> {
  await db.schema.dropTable('sprints').execute();
  await db.schema.dropTable('messages').execute();
}

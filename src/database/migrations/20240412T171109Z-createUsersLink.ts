import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>): Promise<void> {
  await db.schema
    .createTable('user_message')
    .addColumn('id', 'integer', (col) => col.primaryKey().notNull())
    .addColumn('user_id', 'integer', (col) =>
      col.notNull()
    )
    .addColumn('message_id', 'integer', (col) =>
      col.notNull()
    )
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>): Promise<void> {
  await db.schema.dropTable('user_message').execute();
}

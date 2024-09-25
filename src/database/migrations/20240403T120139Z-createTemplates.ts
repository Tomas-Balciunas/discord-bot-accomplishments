import { Kysely, SqliteDatabase } from "kysely";

export async function up(db: Kysely<SqliteDatabase>): Promise<void> {
    await db.schema
    .createTable('templates')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('message', 'text', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>): Promise<void> {
    await db.schema.dropTable('templates').execute()
}
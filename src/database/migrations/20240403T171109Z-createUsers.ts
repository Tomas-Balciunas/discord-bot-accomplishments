import { Kysely, SqliteDatabase } from "kysely";

export async function up(db: Kysely<SqliteDatabase>): Promise<void> {
    await db.schema
    .createTable('users')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('username', 'text', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>): Promise<void> {
    await db.schema.dropTable('users').execute()
}
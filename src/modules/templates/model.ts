import { sql, type Insertable, type Selectable, type Updateable } from 'kysely';
import { keys } from './schema';
import { Database, type Templates } from '@/database';

const TABLE = 'templates';
type Row = Templates;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowUpdate = Updateable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export default class TemplateModel {
  constructor(protected db: Database) {}

  selectAll(): Promise<RowSelect[]> {
    return this.db.selectFrom(TABLE).select(keys).execute();
  }

  select(id: number): Promise<RowSelect | undefined> {
    return this.db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst();
  }

  selectRand() {
    return this.db
      .selectFrom(TABLE)
      .select(keys)
      .orderBy(sql`random()`)
      .limit(1)
      .executeTakeFirst();
  }

  create(record: RowInsert): Promise<RowSelect | undefined> {
    return this.db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst();
  }

  update(id: number, partial: RowUpdate): Promise<RowSelect | undefined> {
    return this.db
      .updateTable(TABLE)
      .set(partial)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst();
  }

  remove(id: number) {
    return this.db
      .deleteFrom(TABLE)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst();
  }
}

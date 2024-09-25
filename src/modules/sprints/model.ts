import type { Insertable, Selectable, Updateable } from 'kysely';
import { keys } from './schema';
import { Database, type Sprints } from '@/database';

const TABLE = 'sprints';
type Row = Sprints;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowUpdate = Updateable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export default class SprintModel {
  constructor(protected db: Database) {}

  selectAll(): Promise<RowSelect[]> {
    return this.db.selectFrom(TABLE).select(keys).execute();
  }

  selectTitle(sprint: string): Promise<RowSelect | undefined> {
    return this.db
      .selectFrom(TABLE)
      .select(keys)
      .where('title', '=', sprint)
      .executeTakeFirst();
  }

  select(id: number): Promise<RowSelect | undefined> {
    return this.db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
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

import { type Insertable, type Selectable } from 'kysely';
import { keys } from './schema';
import { Database, type Users } from '@/database';

const TABLE = 'users';
type Row = Users;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export default class UserModel {
  constructor(protected db: Database) {}

  selectAll(): Promise<RowSelect[]> {
    return this.db
    .selectFrom(TABLE)
    .select(keys)
    .execute()
  }

  selectUsername(username: string): Promise<RowSelect | undefined> {
    return this.db
      .selectFrom(TABLE)
      .select(keys)
      .where('username', '=', username)
      .executeTakeFirst();
  }

  create(record: RowInsert): Promise<RowSelect | undefined> {
    return this.db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst();
  }
}

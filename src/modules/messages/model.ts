import type { Insertable, Selectable } from 'kysely';
import { keys } from './schema';
import { type Users, type Messages, Database } from '@/database';

const TABLE = 'messages';
const LINK_TABLE = 'userMessage';
type Row = Messages;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export interface ByUser {
  name: string;
  sprint: string;
  message: string;
  gif: string;
}

export interface BySprint {
  sprint: string;
  message: string;
  gif: string;
}

export default class MessageModel {
  constructor(protected db: Database) {}

  selectAllMsg(): Promise<RowSelect[]> {
    return this.db.selectFrom(TABLE).select(keys).execute();
  }

  selectAllByUser(user: string): Promise<ByUser[]> {
    return this.db
      .selectFrom(TABLE)
      .innerJoin('userMessage as l', 'l.messageId', `${TABLE}.id`)
      .innerJoin('users as u', 'u.id', `l.userId`)
      .innerJoin('templates as t', 't.id', `${TABLE}.templateId`)
      .innerJoin('sprints as s', 's.id', `${TABLE}.sprintId`)
      .select(['u.name', 's.title as sprint', 't.message', `${TABLE}.gif`])
      .where('u.username', '=', user)
      .execute();
  }

  selectAllBySprint(sprint: string): Promise<BySprint[]> {
    return this.db
      .selectFrom(TABLE)
      .innerJoin('templates as t', 't.id', `${TABLE}.templateId`)
      .innerJoin('sprints as s', 's.id', `${TABLE}.sprintId`)
      .select([
        's.fullTitle as sprint',
        's.title as code',
        't.message',
        `${TABLE}.gif`,
      ])
      .where('s.title', '=', sprint)
      .execute();
  }

  create(record: RowInsert, user: Users): Promise<RowSelect | undefined> {
    return this.db.transaction().execute(async (tx) => {
      const msg = await tx
        .insertInto(TABLE)
        .values(record)
        .returning(keys)
        .executeTakeFirst();

      if (user && msg) {
        await tx
          .insertInto(LINK_TABLE)
          .values({ userId: user.id as number, messageId: msg.id as number })
          .execute();
      }

      return msg;
    });
  }
}

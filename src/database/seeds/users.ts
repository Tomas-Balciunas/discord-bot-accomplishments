/* eslint-disable no-console */
import { parseInsertable } from '@/modules/users/schema';
import UserModel from '@/modules/users/model';
import { Database } from '..';

const users = [
  { name: 'Tomas Balčiūnas', username: 'tbalci' },
  { name: 'Emma Smith', username: 'esmith' },
  { name: 'John Doe', username: 'jdoe' },
  { name: 'Sophia Garcia', username: 'sgarci' },
  { name: 'Liam Johnson', username: 'ljohns' },
  { name: 'Olivia Martinez', username: 'omarti' },
  { name: 'Noah Brown', username: 'nbrown' },
  { name: 'Ava Taylor', username: 'ataylo' },
  { name: 'William Anderson', username: 'wander' },
  { name: 'Isabella Wilson', username: 'iwilso' },
];

export async function seedUsers(db: Database): Promise<void> {
  const user = new UserModel(db)
  console.log('Seeding users...');
  await Promise.all(
    users.map(async (item) => {
      const u = parseInsertable(item);
      Promise.resolve(user.create(u));
    })
  );
  console.log('Seeding users complete.');
}

import { seedSprints } from '@/database/seeds/sprints';
import { seedTemplates } from './templates';
import { seedUsers } from './users';
import { makeDb } from '..';
import { env } from '@/utils/env';

const { DATABASE_URL } = env;

const db = makeDb(DATABASE_URL)

function seed() {
  seedSprints(db);
  seedTemplates(db);
  seedUsers(db);
}

seed();

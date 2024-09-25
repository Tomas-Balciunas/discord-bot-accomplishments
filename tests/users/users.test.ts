import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import supertest from 'supertest';
import { createFor } from '../utils';
import { makeDb } from '@/database';
import { env } from '@/utils/env';
import { makeApp } from '@/app';

const { TEST_DATABASE_URL } = env;

const db = makeDb(TEST_DATABASE_URL);
const app = makeApp(db);

const createEntry = createFor(db, 'users');

const blueprint = {
  id: expect.any(Number),
  name: expect.any(String),
  username: expect.any(String),
};

const dummy = { name: 'name', username: 'username' };

beforeEach(async () => {
  await db.deleteFrom('users').execute();
});

afterEach(async () => {
  await db.deleteFrom('users').execute();
});

describe('GET /users', () => {
  it('Returns an empty array if there are no users', async () => {
    const response = await supertest(app).get('/users');

    expect(response.body).toEqual([]);
  });

  it('Returns a list of users', async () => {
    await createEntry(dummy);
    const response = await supertest(app).get('/users');

    expect(response.body).toEqual([blueprint]);
  });
});

describe('POST /users', () => {
  it('Throws an error if request body is incorrect', async () => {
    const data = { wrong: 'user' };
    const response = await supertest(app).post('/users').send(data);

    expect(response.statusCode).toBe(400);
  });

  it('Creates a user', async () => {
    const response = await supertest(app).post('/users').send(dummy);

    expect(response.body).toEqual(blueprint);
  });
});

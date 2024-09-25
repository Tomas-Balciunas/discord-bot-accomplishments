import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import supertest from 'supertest';
import { createFor } from '../utils';
import { makeDb } from '@/database';
import { env } from '@/utils/env';
import { makeApp } from '@/app';

const { TEST_DATABASE_URL } = env;

const db = makeDb(TEST_DATABASE_URL);
const app = makeApp(db);

const createEntry = createFor(db, 'templates');

const blueprint = { id: expect.any(Number), message: expect.any(String) };
const dummy = { message: 'msg 1' };

beforeEach(async () => {
  await db.deleteFrom('templates').execute();
});

afterEach(async () => {
  await db.deleteFrom('templates').execute();
});

describe('GET /templates', () => {
  it('Returns an empty array if there are no templates', async () => {
    const response = await supertest(app).get('/templates');

    expect(response.body).toEqual([]);
  });

  it('Returns a list of templates', async () => {
    await createEntry(dummy);
    const response = await supertest(app).get('/templates');

    expect(response.body).toEqual([blueprint]);
  });
});

describe('GET /templates/rand', async () => {
  it('Throws an error if no template is found', async () => {
    const response = await supertest(app).get('/templates/rand');

    expect(response.statusCode).toBe(404);
  });

  it('Returns a template', async () => {
    await createEntry(dummy);
    const response = await supertest(app).get('/templates/rand');

    expect(response.body).toEqual(blueprint);
  });
});

describe('GET /templates/:id', async () => {
  it('Throws an error if no template is found', async () => {
    const response = await supertest(app).get('/templates/1');

    expect(response.statusCode).toBe(404);
  });

  it('Returns a template', async () => {
    await createEntry(dummy);
    const response = await supertest(app).get('/templates/1');

    expect(response.body).toEqual(blueprint);
  });
});

describe('POST /templates', () => {
  it('Throws an error if request body is incorrect', async () => {
    const data = { wrong: 'msg 1' };
    const response = await supertest(app).post('/templates').send(data);

    expect(response.statusCode).toBe(400);
  });

  it('Creates a template', async () => {
    const response = await supertest(app).post('/templates').send(dummy);

    expect(response.body).toEqual(blueprint);
  });
});

describe('PATCH /templates/:id', () => {
  it('Throws an error if request body is incorrect', async () => {
    const data = { wrong: 'msg 1' };
    const response = await supertest(app).patch('/templates/1').send(data);

    expect(response.statusCode).toBe(400);
  });

  it('Throws an error if no template is found', async () => {
    const response = await supertest(app).patch('/templates/1').send(dummy);

    expect(response.statusCode).toBe(404);
  });

  it('Updates a template', async () => {
    const updated = { id: expect.any(Number), message: 'msg 2' };
    await createEntry(dummy);
    const response = await supertest(app).patch('/templates/1').send(updated);

    expect(response.body).toEqual(updated);
  });
});

describe('DELETE /templates/:id', () => {
  it('Throws an error if no template is found', async () => {
    const response = await supertest(app).delete('/templates/1');

    expect(response.statusCode).toBe(404);
  });

  it('Deletes a template', async () => {
    await createEntry(dummy);
    const response = await supertest(app).delete('/templates/1');

    expect(response.body).toEqual(blueprint);
  });
});

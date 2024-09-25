import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import supertest from 'supertest';
import sinon from 'sinon';
import { createFor } from '@tests/utils';
import { env } from '@/utils/env';
import { makeDb } from '@/database';
import { makeApp } from '@/app';
import SprintService from '@/modules/sprints/services';

const { TEST_DATABASE_URL } = env;

const db = makeDb(TEST_DATABASE_URL);
const app = makeApp(db);

const createEntry = createFor(db, 'sprints');

const blueprint = {
  id: expect.any(Number),
  title: expect.any(String),
  fullTitle: expect.any(String),
};

const dummy = { title: 'AB-1.2', fullTitle: 'full title' };

beforeEach(async () => {
  await db.deleteFrom('sprints').execute();
});

afterEach(async () => {
  await db.deleteFrom('sprints').execute();
});

describe('GET /sprints', () => {
  it('Returns an empty array if there are no sprints', async () => {
    const response = await supertest(app).get('/sprints');
    expect(response.body).toEqual([]);
  });

  it('Returns a list of sprints', async () => {
    await createEntry(dummy);
    const response = await supertest(app).get('/sprints');

    expect(response.body).toEqual([blueprint]);
  });
});

describe('GET /sprints/:id', async () => {
  it('Throws an error if no sprint is found', async () => {
    const response = await supertest(app).get('/sprints/1');
    expect(response.statusCode).toBe(404);
  });

  it('Returns a sprint', async () => {
    await createEntry(dummy);
    const response = await supertest(app).get('/sprints/1');
    expect(response.body).toEqual(blueprint);
  });
});

describe('POST /sprints', () => {
  it('Throws an error if request body is incorrect', async () => {
    const data = { wrong: 'msg 1' };

    const response = await supertest(app).post('/sprints').send(data);

    expect(response.statusCode).toBe(400);
  });

  it("Throws an error if sprint code's format is incorrect", async () => {
    const data = { title: 'AB1.2', fullTitle: 'text' };

    const response = await supertest(app).post('/sprints').send(data);

    expect(response.statusCode).toBe(400);
  });

  it('Creates a sprint', async () => {
    const wrap = sinon.stub(SprintService.prototype, 'createNotif');
    const response = await supertest(app).post('/sprints').send(dummy);
    wrap.restore();

    expect(response.body).toEqual(blueprint);
  });
});

describe('PATCH /sprints/:id', () => {
  it('Throws an error if request body is incorrect', async () => {
    const data = { wrong: 'huh' };

    const response = await supertest(app).patch('/sprints/1').send(data);

    expect(response.statusCode).toBe(400);
  });

  it("Throws an error if sprint code's format is incorrect", async () => {
    const data = { title: 'AB1.2', fullTitle: 'text' };

    const response = await supertest(app).post('/sprints').send(data);

    expect(response.statusCode).toBe(400);
  });

  it('Throws an error if no sprint is found', async () => {
    const response = await supertest(app).patch('/sprints/1').send(dummy);

    expect(response.statusCode).toBe(404);
  });

  it('Updates a sprint', async () => {
    const wrap = sinon.stub(SprintService.prototype, 'updateNotif');

    const updated = {
      id: expect.any(Number),
      title: 'AB-2.2',
      fullTitle: 'updated',
    };

    await createEntry(dummy);

    const response = await supertest(app).patch('/sprints/1').send(updated);

    wrap.restore();

    sinon.assert.calledOnce(wrap);
    expect(response.body).toEqual(updated);
  });
});

describe('DELETE /sprints/:id', () => {
  it('Throws an error if no sprint is found', async () => {
    const response = await supertest(app).delete('/sprints/1');

    expect(response.statusCode).toBe(404);
  });

  it('Deletes a sprint', async () => {
    const wrap = sinon.stub(SprintService.prototype, 'deleteNotif');
    const deleted = {
      id: expect.any(Number),
      title: 'AB-1.2',
      fullTitle: 'full title',
    };
    await createEntry(dummy);

    const response = await supertest(app).delete('/sprints/1');
    wrap.restore();
    expect(response.body).toEqual(deleted);
  });
});

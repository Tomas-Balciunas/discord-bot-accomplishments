import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import supertest from 'supertest';
import { createFor } from '@tests/utils';
import sinon from 'sinon';
import { makeDb } from '@/database';
import { makeApp } from '@/app';
import { env } from '@/utils/env';
import MessageService from '@/modules/messages/services';

const { TEST_DATABASE_URL } = env;

const db = makeDb(TEST_DATABASE_URL);
const app = makeApp(db);
const templateEntry = createFor(db, 'templates');
const userEntry = createFor(db, 'users');
const sprintEntry = createFor(db, 'sprints');
const messageEntry = createFor(db, 'messages');
const linkEntry = createFor(db, 'userMessage');

const blueprint = {
  id: expect.any(Number),
  templateId: expect.any(Number),
  sprintId: expect.any(Number),
  gif: expect.any(String),
};

const bpSprint = {
  gif: expect.any(String),
  message: expect.any(String),
  code: expect.any(String),
  sprint: expect.any(String),
};

const bpUser = {
  gif: expect.any(String),
  message: expect.any(String),
  name: expect.any(String),
  sprint: expect.any(String),
};

const dummyT = { id: 100, message: 'msg 1' };
const dummyS = { id: 100, title: 'AB', fullTitle: 'full title' };
const dummyU = { id: 100, name: 'full name', username: 'test' };
const dummyM = { id: 100, templateId: 100, sprintId: 100, gif: '123' };

beforeEach(async () => {
  await db.deleteFrom('userMessage').execute();
  await db.deleteFrom('messages').execute();
  await db.deleteFrom('users').execute();
  await db.deleteFrom('sprints').execute();
  await db.deleteFrom('templates').execute();
});

afterEach(async () => {
  await db.deleteFrom('userMessage').execute();
  await db.deleteFrom('messages').execute();
  await db.deleteFrom('users').execute();
  await db.deleteFrom('sprints').execute();
  await db.deleteFrom('templates').execute();
});

describe('GET /messages', () => {
  it('Returns a not found code if there are no messages', async () => {
    const response = await supertest(app).get('/messages');

    expect(response.statusCode).toEqual(404);
  });

  it('Returns a list of messages', async () => {
    await templateEntry(dummyT);
    await sprintEntry(dummyS);
    await messageEntry(dummyM);

    const response = await supertest(app).get('/messages');

    expect(response.body).toEqual([blueprint]);
  });

  it('Returns a list of messages by sprint', async () => {
    await templateEntry(dummyT);
    await sprintEntry(dummyS);
    await messageEntry(dummyM);

    const response = await supertest(app).get('/messages?sprintCode=AB');

    expect(response.body).toEqual([bpSprint]);
  });

  it('Returns a list of messages by user', async () => {
    const l = { userId: 100, messageId: 100 };
    await userEntry(dummyU);
    await templateEntry(dummyT);
    await sprintEntry(dummyS);
    await messageEntry(dummyM);
    await linkEntry(l);

    const response = await supertest(app).get('/messages?username=test');

    expect(response.body).toEqual([bpUser]);
  });
});

describe('POST /messages', () => {
  it('Throws an error if sprint code format is incorrect', async () => {
    const response = await supertest(app)
      .post('/messages')
      .send({ username: 'name', sprintCode: 'AB11' });

    expect(response.statusCode).toBe(400);
  });

  it('Creates a message', async () => {
    const wrap = sinon.stub(MessageService.prototype, 'handleDiscordMessage');
    const wrapdata = sinon
      .stub(MessageService.prototype, 'handleMessageData')
      .callsFake(() =>
        Promise.resolve({
          gif: 'test',
          sprint: dummyS,
          user: dummyU,
          template: dummyT,
        })
      );

    await templateEntry(dummyT);
    await userEntry(dummyU);
    await sprintEntry(dummyS);

    const response = await supertest(app)
      .post('/messages')
      .send({ username: 'name', sprintCode: 'AB-1.1' });

    wrap.restore();
    wrapdata.restore();

    expect(response.body).toEqual(blueprint);
  });
});

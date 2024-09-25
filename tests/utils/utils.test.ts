import { describe, expect, it, afterEach } from 'vitest';
import {
  BaseChannel,
  Client,
  Collection,
  Guild,
  GuildMember,
  UserMention,
} from 'discord.js';
import Sinon from 'sinon';
import axios from 'axios';
import * as utils from '@/utils';
import { BotActions } from '@/bot/actions';
import { Sprints } from '@/database';
import NotFound from '@/utils/errors/NotFound';

const cl = new Client({ intents: [] });
const bot = new BotActions();

afterEach(() => {
  Sinon.restore();
});

describe('Text utilities', () => {
  it('Returns composed learner nickname', () => {
    const user = { id: 1, name: 'John Doe', username: 'jdoe' };
    const composed = utils.composeLearnerNickname(user);

    expect(composed).toEqual('John Doe | jdoe');
  });

  it('Returns composed message for DM', () => {
    const sprint = { id: 1, title: '', fullTitle: 'sprint' };
    const composed = utils.composeAccomplishmentDM(sprint);

    expect(composed).toEqual('Congratulations on completing sprint!');
  });

  it('Returns composed module channel name', () => {
    const sprint: Sprints = {
      id: 1,
      title: 'AB-1.2',
      fullTitle: '',
    };

    const result = utils.composeModuleChannelName(sprint);

    expect(result).toBe('module-1');
  });

  it('Returns composed accomplishment message', () => {
    const id = '123';
    const member = Reflect.construct(GuildMember, [{}]);
    const wrap = Sinon.stub(GuildMember.prototype, 'toString').callsFake(
      (): UserMention => `<@${id}>`
    );

    const sprint = { id: 1, title: 'title', fullTitle: 'sprint' };
    const template = { id: 1, message: 'msg' };
    const composed = utils.composeAccomplishmentMessage(
      template,
      sprint,
      member
    );

    wrap.restore();
    expect(composed).toEqual('<@123> has just completed sprint! msg');
  });
});

describe('Bot actions', () => {
  const guild = Reflect.construct(Guild, [cl, { id: '', name: 'guild' }]);

  it('Throws error if channel is not a text channel', () => {
    const ch = Reflect.construct(BaseChannel, [cl, { id: '12345', type: 1 }]);
    guild.channels.cache.set('12345', ch);

    expect(() => bot.getTextChannel('12345', guild)).toThrow(Error);
  });

  it('Throws error if channel is not found', () => {
    const ch = Reflect.construct(BaseChannel, [cl, { id: '12346', type: 0 }]);
    guild.channels.cache.set('12346', ch);

    expect(() => bot.getTextChannel('999', guild)).toThrow(NotFound);
  });

  it('Returns channel', () => {
    const ch = Reflect.construct(BaseChannel, [cl, { id: '12345', type: 0 }]);
    guild.channels.cache.set('12345', ch);
    const result = bot.getTextChannel('12345', guild);

    expect(result.id).toBe('12345');
  });

  it('Throws error if user is a bot', async () => {
    const member: Collection<string, GuildMember> = [
      guild,
      { nickname: 'test', user: { bot: true } },
    ] as unknown as Collection<string, GuildMember>;

    Sinon.stub(BotActions.prototype, 'getServerMembers').callsFake(
      async (): Promise<Collection<string, GuildMember>> => member
    );

    expect(() => bot.getUserByNickname('test', guild)).rejects.toThrow(Error);
  });

  it('Throws an error if user is not found', async () => {
    const member: Collection<string, GuildMember> = [
      guild,
      { nickname: 'test', user: { bot: false } },
    ] as unknown as Collection<string, GuildMember>;

    Sinon.stub(BotActions.prototype, 'getServerMembers').callsFake(
      async (): Promise<Collection<string, GuildMember>> => member
    );

    expect(() => bot.getUserByNickname('wrong', guild)).rejects.toThrow(
      NotFound
    );
  });

  it('Returns user by nickname', async () => {
    const member: Collection<string, GuildMember> = [
      guild,
      { nickname: 'test', user: { bot: false } },
    ] as unknown as Collection<string, GuildMember>;

    Sinon.stub(BotActions.prototype, 'getServerMembers').callsFake(
      async (): Promise<Collection<string, GuildMember>> => member
    );

    const user = await bot.getUserByNickname('test', guild);

    expect(user.nickname).toBe('test');
  });
});

describe('Giphy api', () => {
  it('Throws', async () => {
    Sinon.stub(axios, 'get').callsFake(() =>
      Promise.resolve({
        data: {
          data: [],
          meta: {
            status: '400',
            msg: 'test',
          },
        },
      })
    );

    try {
      await utils.fetchGif();
    } catch (err) {
      expect(err).toStrictEqual(
        Error('No gif received: test status code: 400')
      );
    }
  });

  it('Fetches gif link', async () => {
    Sinon.stub(axios, 'get').callsFake(() =>
      Promise.resolve({
        data: {
          data: {
            embed_url: 'test',
          },
        },
      })
    );

    const response = await utils.fetchGif();

    expect(response).toEqual('test');
  });
});
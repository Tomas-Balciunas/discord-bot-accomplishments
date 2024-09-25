/* eslint-disable class-methods-use-this */
import z from 'zod';
import { env } from '@/utils/env';
import { BotActions } from '@/bot/actions';
import * as utils from '@/utils';
import * as schema from './schema';
import { Messages } from '@/database';
import NotFound from '@/utils/errors/NotFound';
import MessageModel, { ByUser, BySprint } from './model';
import TemplateService from '../templates/service';
import SprintService from '../sprints/services';
import UserService from '../users/service';

const { CH_ACCOMPLISHMENTS_ID, SERVER_ID } = env;

export default class MessageService extends MessageModel {
  private result: Messages[] | ByUser[] | BySprint[] | undefined;

  async handleGetAllMessages(username: any, sprint: any) {
    if (username) {
      this.result = await this.selectAllByUser(username as string);
    } else if (sprint) {
      this.result = await this.selectAllBySprint(sprint as string);
    } else {
      this.result = await this.selectAllMsg();
    }

    if (!this.result || this.result.length === 0) {
      throw new NotFound('No messages found.');
    }

    return this.result;
  }

  async handleCreateMsg(
    data: z.infer<typeof schema.dataSchema>
  ): Promise<Messages | undefined> {
    const msg = {
      templateId: data.template.id,
      sprintId: data.sprint.id,
      gif: data.gif,
    };

    const insertable = schema.parseInsertable(msg);
    const result = await this.create(insertable, data.user);

    return result;
  }

  async handleMessageData(body: any) {
    const t = new TemplateService(this.db);
    const s = new SprintService(this.db);
    const u = new UserService(this.db);

    const { templateId, username, sprintCode } = body;

    const template = await t.fetchTemplate(templateId);
    const user = await u.fetchUserByUsername(username);
    const sprint = await s.fetchSprintByCode(sprintCode);
    const gif = await utils.fetchGif();

    const data = schema.parseData({ user, template, sprint, gif });

    return data;
  }

  async handleDiscordMessage(
    data: z.infer<typeof schema.dataSchema>
  ): Promise<void> {
    const bot = new BotActions();
    const { user, template, sprint, gif } = data;

    const nickname = utils.composeLearnerNickname(user);
    const guild = bot.getServer(SERVER_ID);
    const discordUser = await bot.getUserByNickname(nickname, guild);

    const dm = utils.composeAccomplishmentDM(sprint);
    const text = utils.composeAccomplishmentMessage(
      template,
      sprint,
      discordUser
    );

    await bot.sendChannelMessage(text, CH_ACCOMPLISHMENTS_ID, SERVER_ID);
    await bot.sendChannelMessage(gif, CH_ACCOMPLISHMENTS_ID, SERVER_ID);
    await bot.sendDirectMessage(dm, discordUser);
  }
}

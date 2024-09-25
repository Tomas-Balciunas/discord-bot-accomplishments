/* eslint-disable class-methods-use-this */
import { TextChannel, GuildMember, Guild, Collection } from 'discord.js';
import client from '.';
import NotFound from '@/utils/errors/NotFound';

export class BotActions {
  async getUserByNickname(
    nickname: string,
    guild: Guild
  ): Promise<GuildMember> {
    const ppl = await this.getServerMembers(guild);

    const discordUser: GuildMember | undefined = ppl.find(
      (u) => u.nickname === nickname
    );

    if (!discordUser)
      throw new NotFound(`Discord user ${nickname} not found in ${guild.name}`);

    if (discordUser.user.bot) throw new Error(`User ${nickname} is a bot`);

    return discordUser;
  }

  getTextChannel(channel_id: string, server: Guild): TextChannel {
    const ch = server.channels.cache.get(channel_id);

    if (!ch)
      throw new NotFound(
        `Discord channel with id ${channel_id} not found in server ${server.name}.`
      );

    if (ch.type !== 0)
      throw new Error(`Channel ${channel_id} is not a text channel.`);

    return ch;
  }

  getServer(server_id: string): Guild {
    const guild = client.guilds.cache.get(server_id);

    if (!guild) {
      throw new NotFound(`Guild with id ${server_id} not found.`);
    }

    return guild;
  }

  async getServerMembers(
    server: Guild
  ): Promise<Collection<string, GuildMember>> {
    const members = await server.members.fetch();

    return members;
  }

  async sendChannelMessage(
    text: string,
    channel_id: string,
    server_id: string
  ) {
    const server = this.getServer(server_id);
    const ch = this.getTextChannel(channel_id, server);
    const msg = await ch.send(text);

    if (!msg) {
      throw new Error('Error sending discord message');
    }
  }

  async sendDirectMessage(text: string, user: GuildMember) {
    if (user.user.bot) return;

    const msg = await user.send(text);

    if (!msg) {
      throw new Error('Error sending direct message');
    }
  }

  async createTextChannel(name: string, server_id: string) {
    const server = this.getServer(server_id);
    await server.channels.create({ name, type: 0 });
  }
}

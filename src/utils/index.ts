import axios from 'axios';
import { GuildMember } from 'discord.js';
import { env } from '@/utils/env';
import { Templates, Sprints, Users } from '@/database';
import { BotActions } from '@/bot/actions';

const { GIPHY_API_KEY, SECONDARY_SERVER_ID } = env;

export async function fetchGif() {
  const keyword: string = 'celebration';
  const rating: string = 'g';

  const response = await axios.get(
    `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=${keyword}&rating=${rating}`
  );

  if (response.data.data.length === 0)
    throw new Error(
      `No gif received: ${response.data.meta.msg} status code: ${response.data.meta.status}`
    );

  const gif = response.data.data.embed_url;
  return gif;
}

export const sprintChanges = (compose: Function, data: Sprints) => {
  const bot = new BotActions();
  const server = bot.getServer(SECONDARY_SERVER_ID);
  const name = composeModuleChannelName(data);
  const ch = server.channels.cache.find((s) => s.name === name);

  if (ch) {
    const text = compose(data);
    bot.sendChannelMessage(text, ch.id, SECONDARY_SERVER_ID);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Channel ${name} not found, notification not sent.`);
  }
};

export function composeAccomplishmentMessage(
  template: Templates,
  sprint: Sprints,
  user: GuildMember
) {
  return `${user} has just completed ${sprint.fullTitle}! ${template.message}`;
}

export function composeAccomplishmentDM(sprint: Sprints) {
  return `Congratulations on completing ${sprint.fullTitle}!`;
}

export function composeLearnerNickname(user: Users) {
  return [user.name, user.username].join(' | ');
}

export function composeModuleChannelName(old: Sprints) {
  return `module-${old.title.split('-')[1][0]}`;
}

export function composeSprintUpdateMessage(result: Sprints, old: Sprints) {
  return `Sprint "${old.title}: ${old.fullTitle}" has been updated to: "${result.title}": "${result.fullTitle}".`;
}

export function composeSprintCreateMessage(sprint: Sprints) {
  return `Sprint ${sprint.title}: ${sprint.fullTitle} has been created.`;
}

export function composeSprintDeleteMessage(sprint: Sprints) {
  return `Sprint ${sprint.title}: ${sprint.fullTitle} has been deleted.`;
}

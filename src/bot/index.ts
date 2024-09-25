import { Client, GatewayIntentBits } from 'discord.js';
import { env } from '@/utils/env';

const { DISCORD_BOT_TOKEN } = env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', (c) => {
  // eslint-disable-next-line no-console
  console.log(`Logged in as ${c.user.tag}!`);
});

export async function bot() {
  await client.login(DISCORD_BOT_TOKEN);
}

bot()

export default client;

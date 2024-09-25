/* eslint-disable no-console */
import { Client, GatewayIntentBits } from 'discord.js';
import { env } from '@/utils/env';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
});

const { SECONDARY_SERVER_ID, DISCORD_BOT_TOKEN } = env;
const channel = ['module-1', 'module-2', 'module-3', 'module-4'];

const huh = async () => {
  await client.login(DISCORD_BOT_TOKEN);
  const guild = client.guilds.cache.get(SECONDARY_SERVER_ID);

  if (!guild) {
    console.log('Guild not found');
    process.exit(1);
  }

  await Promise.all(
    channel.map(async (c) => {
      const ch = guild.channels.create({ name: c, type: 0 });
      console.log(`Channel ${c} created!`);

      return ch;
    })
  );

  process.exit(1);
};

huh();

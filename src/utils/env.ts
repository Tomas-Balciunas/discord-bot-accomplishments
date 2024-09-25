import 'dotenv/config';
import z from 'zod';

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  TEST_DATABASE_URL: z.string().min(1),
  GIPHY_API_KEY: z.string().min(1),
  DISCORD_BOT_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  CH_ACCOMPLISHMENTS_ID: z.string().min(1),
  SERVER_ID: z.string().min(1),
  SECONDARY_SERVER_ID: z.string().min(1),
});

export const env = schema.parse(process.env);

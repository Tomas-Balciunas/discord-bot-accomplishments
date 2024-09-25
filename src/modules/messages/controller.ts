import express, { Request } from 'express';
import MessageService from './services';
import { Database } from '@/database';
import { tryCatch, validateBody } from '@/utils/middleware/middleware';
import { bodySchema } from './schema';

export default (db: Database) => {
  const router = express.Router();
  const service = new MessageService(db);

  router
    .route('/')
    .get(
      tryCatch(async (req: Request) => {
        const { username, sprintCode } = req.query;
        const result = await service.handleGetAllMessages(username, sprintCode);

        return result;
      })
    )
    .post(
      validateBody(bodySchema),
      tryCatch(async (req: Request) => {
        const data = await service.handleMessageData(req.body);
        await service.handleDiscordMessage(data);
        const msg = await service.handleCreateMsg(data);

        return msg;
      })
    );

  return router;
};

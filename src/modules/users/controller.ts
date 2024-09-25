import express, { Request } from 'express';
import { Database } from '@/database';
import UserModel from './model';
import { tryCatch } from '@/utils/middleware/middleware';
import * as schema from './schema';

export default (db: Database) => {
  const router = express.Router();
  const user = new UserModel(db);

  router.route('/')
  .get(tryCatch(async () => {
    const result = await user.selectAll()

    return result
  }))
  .post(
    tryCatch(async (req: Request) => {
      const body = schema.parseInsertable(req.body);
      const result = await user.create(body);

      return result;
    })
  );

  return router;
};

import express, { Request } from 'express';
import * as schema from './schema';
import SprintService from './services';
import NotFound from '@/utils/errors/NotFound';
import { Database } from '@/database';
import { tryCatch } from '@/utils/middleware/middleware';

export default (db: Database) => {
  const router = express.Router();
  const sprint = new SprintService(db);

  router
    .route('/')
    .get(
      tryCatch(async () => {
        const result = await sprint.selectAll();

        return result;
      })
    )
    .post(
      tryCatch(async (req: Request) => {
        const body = schema.parseInsertable(req.body);
        const result = await sprint.create(body);
        if (result) sprint.createNotif(result)

        return result;
      })
    );

  router
    .route('/:id')
    .get(
      tryCatch(async (req: Request) => {
        const id = schema.parseId(req.params.id);
        const result = await sprint.select(id);

        if (!result) {
          throw new NotFound('Sprint not found.');
        }

        return result;
      })
    )
    .patch(
      tryCatch(async (req: Request) => {
        const [id, body] = [req.params.id, req.body];
        const { old, result } = await sprint.handleUpdateSprint(id, body);

        if (!result) {
          throw new NotFound('Sprint not found.');
        }

        if (result && old) {
          sprint.updateNotif(result, old);
        }

        return result;
      })
    )
    .delete(
      tryCatch(async (req: Request) => {
        const id = schema.parseId(req.params.id);
        const result = await sprint.remove(id);

        if (!result) {
          throw new NotFound('Sprint not found.');
        }

        sprint.deleteNotif(result)

        return result;
      })
    );

  return router
};

import express, { Request } from 'express';
import * as schema from './schema';
import TemplateModel from './model';
import NotFound from '@/utils/errors/NotFound';
import { tryCatch } from '@/utils/middleware/middleware';
import { Database } from '@/database';

export default (db: Database) => {
  const router = express.Router();
  const template = new TemplateModel(db);

  router.route('/rand').get(
    tryCatch(async () => {
      const result = await template.selectRand();

      if (!result) {
        throw new NotFound('Template not found.');
      }

      return result;
    })
  );

  router
    .route('/')
    .get(
      tryCatch(async () => {
        const result = await template.selectAll();

        return result;
      })
    )
    .post(
      tryCatch(async (req: Request) => {
        const body = schema.parseInsertable(req.body);
        const result = await template.create(body);

        return result;
      })
    );

  router
    .route('/:id')
    .get(
      tryCatch(async (req: Request) => {
        const id = schema.parseId(req.params.id);
        const result = await template.select(id);

        if (!result) {
          throw new NotFound('Template not found.');
        }

        return result;
      })
    )
    .patch(
      tryCatch(async (req: Request) => {
        const id = schema.parseId(req.params.id);
        const partial = schema.parseUpdateable(req.body);
        const result = await template.update(id, partial);

        if (!result) {
          throw new NotFound('Template not found.');
        }

        return result;
      })
    )
    .delete(
      tryCatch(async (req: Request) => {
        const id = schema.parseId(req.params.id);
        const result = await template.remove(id);

        if (!result) {
          throw new NotFound('Template not found.');
        }

        return result;
      })
    );

  return router;
};

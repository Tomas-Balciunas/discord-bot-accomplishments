import express from 'express';
import messages from './modules/messages/controller';
import templates from './modules/templates/controller';
import sprints from './modules/sprints/controller';
import users from './modules/users/controller';
import { errorHandler } from './utils/middleware/middleware';
import { Database } from './database';

export function makeApp(db: Database) {
  const app = express();

  app.use(express.json());

  app.get('/', (req, res) => res.send('Hi'));

  app.use('/messages',  messages(db));
  app.use('/templates', templates(db));
  app.use('/sprints', sprints(db));
  app.use('/users', users(db));

  app.use(errorHandler);

  return app;
}

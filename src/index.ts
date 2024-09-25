import { makeApp } from './app';
import { makeDb } from './database';
import { env } from './utils/env';

const { DATABASE_URL } = env;

const db = makeDb(DATABASE_URL);
const app = makeApp(db);

const PORT = 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${PORT}`);
});

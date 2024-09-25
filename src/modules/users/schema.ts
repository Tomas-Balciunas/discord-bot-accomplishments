import { z } from 'zod';
import { Users } from '@/database';

type Record = Users;

export const schema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().min(1).max(500),
  username: z.string().min(1).max(500)
});

const insertable = schema.omit({ id: true });
const partial = insertable.partial();

export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseUsername = (username: unknown) => schema.shape.username.parse(username)
export const parse = (record: unknown) => schema.parse(record);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parsePartial = (record: unknown) => partial.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];

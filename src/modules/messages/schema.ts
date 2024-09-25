import { z } from 'zod';
import { Messages } from '@/database';
import { schema as template } from '@/modules/templates/schema';
import { schema as sprint } from '@/modules/sprints/schema';
import { schema as user } from '@/modules/users/schema';

type Record = Messages;

const schema = z.object({
  id: z.coerce.number().int().positive(),
  templateId: z.number().int().positive(),
  sprintId: z.number().int().positive(),
  gif: z.string().min(1).max(500),
});

export const dataSchema = z.object({
  user,
  template,
  sprint,
  gif: z.string().min(1)
});

export const bodySchema = z.object({
  templateId: z.number().int().positive().optional(),
  username: user.shape.username,
  sprintCode: sprint.shape.title,
})

const insertable = schema.omit({ id: true });
const partial = insertable.partial();

export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parse = (record: unknown) => schema.parse(record);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parsePartial = (record: unknown) => partial.parse(record);
export const parseData = (record: unknown) => dataSchema.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];

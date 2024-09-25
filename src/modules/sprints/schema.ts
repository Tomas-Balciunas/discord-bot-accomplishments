import { z } from 'zod';
import { Sprints } from '@/database';

type Record = Sprints;

export const schema = z.object({
  id: z.coerce.number().int().positive(),
  title: z
    .string()
    .regex(/^[A-Z]{2}-\d+\.\d+$/, {
      message: "invalid, example format: 'AA-1.1'",
    })
    .min(1)
    .max(500),
  fullTitle: z.string().min(1).max(500),
});

const insertable = schema.omit({ id: true });
const updateable = schema
  .omit({ id: true })
  .partial()
  .refine(
    ({ title, fullTitle }) => title !== undefined || fullTitle !== undefined,
    { message: 'missing required data to update, provide title and|or fullTitle' }
  );
const partial = insertable.partial();

export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseCode = (code: unknown) => schema.shape.title.parse(code);
export const parse = (record: unknown) => schema.parse(record);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);
export const parsePartial = (record: unknown) => partial.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];

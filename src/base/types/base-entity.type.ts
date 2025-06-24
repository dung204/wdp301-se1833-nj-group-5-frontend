import { z } from 'zod';

export const baseEntitySchema = z.object({
  id: z.string(),
  createTimestamp: z.string(),
  updateTimestamp: z.string(),
  deleteTimestamp: z.string().nullable().optional(),
});

export type BaseEntity = z.infer<typeof baseEntitySchema>;

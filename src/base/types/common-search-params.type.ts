import { z } from 'zod';

export const commonSearchParamsSchema = z.object({
  page: z.number().int().positive().optional().catch(1),
  pageSize: z.number().int().positive().optional().catch(10),
});

export type CommonSearchParams = z.infer<typeof commonSearchParamsSchema>;

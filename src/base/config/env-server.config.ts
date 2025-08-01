import { z } from 'zod';

const envServerSchema = z.object({
  API_URL: z.string().url().endsWith('/'),
});

export const envServer = envServerSchema.parse(process.env);

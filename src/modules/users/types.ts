import { z } from 'zod';

import { BaseEntity } from '@/base/types';

export interface User extends BaseEntity {
  fullName: string;
  address: string | null;
  role: string;
  email: string;
}

export const createUserSchema = z.object({
  fullName: z.string().nonempty('Full name is required'),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

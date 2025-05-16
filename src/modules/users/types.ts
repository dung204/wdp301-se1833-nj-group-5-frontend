import { z } from 'zod';

import { BaseEntity } from '@/base/types';

export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  address: string | null;
}

export const createUserSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

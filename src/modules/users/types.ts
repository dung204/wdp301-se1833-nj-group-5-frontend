import { z } from 'zod';

import { baseEntitySchema } from '@/base/types';
import { Role } from '@/modules/auth';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export const gender = {
  [Gender.MALE]: 'Nam',
  [Gender.FEMALE]: 'Nữ',
  [Gender.OTHER]: 'Khác',
} as const;

export const userSchema = baseEntitySchema.extend({
  email: z.string().trim(),
  fullName: z.string().trim().optional(),
  role: z.nativeEnum(Role),
  gender: z.nativeEnum(Gender).optional(),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = z.object({
  fullName: z.string().trim().nonempty('Tên đầy đủ không được để trống'),
  gender: z.nativeEnum(Gender),
});

export const updateRoleUserSchema = z.object({
  role: z.enum(['CUSTOMER', 'HOTEL_OWNER']).optional(), // 👈 Thêm dòng này
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateRoleUserSchema = z.infer<typeof updateRoleUserSchema>;

export const updateUserSchema = createUserSchema.partial();

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

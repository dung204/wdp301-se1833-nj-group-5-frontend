import { z } from 'zod';

import { baseEntitySchema } from '@/base/types';
import { Role } from '@/modules/auth';
import { userSchema } from '@/modules/users';

export enum RoleUpgradeRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum RequestType {
  CUSTOMER_TO_HOTEL_OWNER = 'CUSTOMER_TO_HOTEL_OWNER',
}

export const roleUpgradeRequestSchema = baseEntitySchema.extend({
  user: userSchema,
  requestType: z.nativeEnum(RequestType),
  currentRole: z.nativeEnum(Role),
  targetRole: z.nativeEnum(Role),
  contactInfo: z.string(),
  reason: z.string(),
  status: z.nativeEnum(RoleUpgradeRequestStatus),
  reviewedBy: userSchema.optional(),
  reviewedAt: z.string().optional(),
  adminNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export type RoleUpgradeRequest = z.infer<typeof roleUpgradeRequestSchema>;

export const createRoleUpgradeRequestSchema = z.object({
  requestType: z.nativeEnum(RequestType),
  targetRole: z.literal(Role.HOTEL_OWNER),
  contactInfo: z
    .string()
    .trim()
    .min(10, 'Thông tin liên hệ phải có ít nhất 10 ký tự')
    .nonempty('Thông tin liên hệ không được để trống'),
  reason: z
    .string()
    .trim()
    .min(20, 'Lý do phải có ít nhất 20 ký tự')
    .nonempty('Lý do không được để trống'),
});

export type CreateRoleUpgradeRequestSchema = z.infer<typeof createRoleUpgradeRequestSchema>;

export const updateRoleUpgradeRequestSchema = z.object({
  status: z.nativeEnum(RoleUpgradeRequestStatus),
  adminNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export type UpdateRoleUpgradeRequestSchema = z.infer<typeof updateRoleUpgradeRequestSchema>;

export const roleUpgradeRequestSearchParamsSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
  status: z.nativeEnum(RoleUpgradeRequestStatus).optional(),
  userId: z.string().optional(),
});

export type RoleUpgradeRequestSearchParams = z.infer<typeof roleUpgradeRequestSearchParamsSchema>;

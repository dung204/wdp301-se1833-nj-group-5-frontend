import { z } from 'zod';

import { BaseEntity, commonSearchParamsSchema } from '@/base/types';

import { User } from '../users';

export enum CancelPolicy {
  NO_REFUND = 'NO_REFUND',
  REFUND_BEFORE_1_DAY = 'REFUND_BEFORE_1_DAY',
  REFUND_BEFORE_3_DAYS = 'REFUND_BEFORE_3_DAYS',
}

export const cancelPolicies = {
  [CancelPolicy.NO_REFUND]: 'Không hoàn phí',
  [CancelPolicy.REFUND_BEFORE_1_DAY]: 'Hoàn phí trước 1 ngày',
  [CancelPolicy.REFUND_BEFORE_3_DAYS]: 'Hoàn phí trước 3 ngày',
} as const;

export const hotelSearchParamsSchema = commonSearchParamsSchema.extend({
  id: z.string().optional(),
  name: z.string().optional(),
  address: z.string().optional(),
  minRating: z.coerce.number().int().min(0).max(5).optional().catch(undefined),
  maxRating: z.coerce.number().int().min(0).max(5).optional().catch(undefined),
  minPrice: z.coerce.number().nonnegative().optional().catch(undefined),
  maxPrice: z.coerce.number().nonnegative().optional().catch(undefined),
  services: z.array(z.string()).optional(),
  cancelPolicy: z.nativeEnum(CancelPolicy).optional().catch(undefined),
});

export type HotelSearchParams = z.infer<typeof hotelSearchParamsSchema>;

export interface Hotel extends BaseEntity {
  name: string;
  address: string;
  description: string;
  owner: User;
  phoneNumber: string;
  checkinTime: {
    from: string;
    to: string;
  };
  checkoutTime: Date;
  avatar: string[];
  rating: number;
  services: string[];
}

export const createHotelSchema = z.object({
  name: z.string().nonempty('Tên khách sạn là bắt buộc'),
  address: z.string().nonempty('Địa chỉ là bắt buộc'),
  description: z.string().nonempty('Mô tả là bắt buộc'),
  phoneNumber: z.string().nonempty('Số điện thoại là bắt buộc'),
  checkinTime: z.object({
    from: z.string().datetime(),
    to: z.string().datetime(),
  }),
  checkoutTime: z.string().datetime(),
  avatar: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5),
});

export type CreateHotelSchema = z.infer<typeof createHotelSchema>;

export const updateHotelSchema = createHotelSchema.partial();

export type UpdateHotelSchema = z.infer<typeof updateHotelSchema>;

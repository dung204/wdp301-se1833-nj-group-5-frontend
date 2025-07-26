import { z } from 'zod';

import { baseEntitySchema, commonSearchParamsSchema } from '@/base/types';
import { hotelSchema } from '@/modules/hotels';

export enum DiscountState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const discountStates = {
  [DiscountState.ACTIVE]: 'Đang hoạt động',
  [DiscountState.INACTIVE]: 'Không hoạt động',
};

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export const discountsSearchParamsSchema = commonSearchParamsSchema.extend({
  id: z.string().optional(),
  minAmount: z.coerce.number().optional(),
  state: z.nativeEnum(DiscountState).optional(),
  hotelId: z.string().optional(),
});

export type DiscountsSearchParams = z.infer<typeof discountsSearchParamsSchema>;

export const discountSchema = baseEntitySchema.extend({
  title: z.string(),
  amount: z.number(),
  expiredTimestamp: z.string(),
  maxQuantityPerUser: z.number(),
  applicableHotels: z.array(hotelSchema),
  usageCount: z.number(),
  state: z.nativeEnum(DiscountState),
});

export type Discount = z.infer<typeof discountSchema>;

export const createDiscountSchema = z.object({
  title: z.string().nonempty('Tiêu đề mã giảm giá không được để trống'),
  amount: z.coerce
    .number()
    .min(5, 'Phần trăm giảm giá phải có tối thiểu 5 và tối đa là 100')
    .max(100, 'Phần trăm giảm giá phải có tối thiểu 5 và tối đa là 100'),
  maxQuantityPerUser: z.coerce
    .number()
    .int()
    .min(1, 'Số lượt tối đa/người phải là số nguyên tối thiểu bằng 1'),
  expiredTimestamp: z
    .date({ message: 'Thời gian hết hạn không được để trống' })
    .min(new Date(), 'Thời gian hết hạn phải là thời điểm trong tương lai'),
  usageCount: z.coerce
    .number()
    .int()
    .min(1, 'Tổng số lượt sử dụng phải là số nguyên tối thiểu bằng 1'),
  applicableHotels: z.array(z.string().uuid()).min(1, 'Vui lòng chọn tối thiểu 1 khách sạn'),
  state: z.nativeEnum(DiscountState),
});

export type CreateDiscountSchema = z.infer<typeof createDiscountSchema>;

// Schema update
export const updateDiscountSchema = createDiscountSchema.partial();
export type UpdateDiscountSchema = z.infer<typeof updateDiscountSchema>;

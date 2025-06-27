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
  id: z.string().trim().optional(),
  name: z.string().trim().optional(),
  address: z.string().trim().optional(),
  minRating: z.coerce.number().int().min(0).max(5).optional().catch(undefined),
  maxRating: z.coerce.number().int().min(0).max(5).optional().catch(undefined),
  minPrice: z.coerce.number().nonnegative().optional().catch(undefined),
  maxPrice: z.coerce.number().nonnegative().optional().catch(undefined),
  services: z.array(z.string().trim()).optional(),
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
  images: string[];
  rating: number;
  services: string[];
}

export const createHotelSchema = z.object({
  name: z.string().trim().nonempty('Tên khách sạn không được để trống'),
  address: z.string().trim().nonempty('Địa chỉ không được để trống'),
  description: z.string().trim().nonempty('Mô tả không được để trống'),
  phoneNumber: z.string().trim().nonempty('Số điện thoại không được để trống'),
  priceHotel: z.coerce.number().positive('Giá tiền phải là số dương'),
  checkinTime: z
    .object(
      {
        from: z.date({ message: 'Vui lòng chọn đầy đủ thời gian ban đầu và kết thúc' }),
        to: z.date({ message: 'Vui lòng chọn đầy đủ thời gian ban đầu và kết thúc' }),
      },
      { message: 'Vui lòng chọn đầy đủ thời gian ban đầu và kết thúc' },
    )
    .refine(({ from, to }) => from.getTime() < to.getTime(), {
      message: 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc',
      path: ['checkinTime'],
    }),
  checkoutTime: z.date({ message: 'Thời gian check-out không được để trống' }),
  rating: z.number({ message: 'Xếp hạng không được để trống' }).int().min(1).max(5),
  cancelPolicy: z.nativeEnum(CancelPolicy, { message: 'Chính sách hủy phòng không được để trống' }),
});

export type CreateHotelSchema = z.infer<typeof createHotelSchema>;

export const updateHotelSchema = createHotelSchema.partial();

export type UpdateHotelSchema = z.infer<typeof updateHotelSchema>;

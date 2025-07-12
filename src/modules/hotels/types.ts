import { z } from 'zod';

import { BaseEntity, commonSearchParamsSchema } from '@/base/types';

import { ImageResponse } from '../media';
import { User } from '../users';
import { HotelUtils } from './utils/hotel.utils';

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
  minPrice: z.coerce
    .number()
    .nonnegative()
    .optional()
    .catch(HotelUtils.DEFAULT_MIN_PRICE)
    .default(HotelUtils.DEFAULT_MIN_PRICE),
  maxPrice: z.coerce
    .number()
    .nonnegative()
    .optional()
    .catch(HotelUtils.DEFAULT_MAX_PRICE)
    .default(HotelUtils.DEFAULT_MAX_PRICE),
  services: z.array(z.string().trim()).optional(),
  cancelPolicy: z.nativeEnum(CancelPolicy).optional().catch(undefined),
  isActive: z.enum(['all', 'true', 'false']).optional().catch('all').default('all'),
});

export type HotelSearchParams = Partial<z.infer<typeof hotelSearchParamsSchema>>;

export interface Hotel extends BaseEntity {
  name: string;
  province: string;
  commune: string;
  address: string;
  description: string;
  owner: User;
  phoneNumber: string;
  priceHotel: number;
  checkinTime: {
    from: string;
    to: string;
  };
  checkoutTime: Date;
  images: ImageResponse[];
  rating: number;
  services: string[];
  cancelPolicy: CancelPolicy;
}

export const createHotelSchema = z.object({
  name: z.string().trim().nonempty('Tên khách sạn không được để trống'),
  province: z.string().trim().nonempty('Vui lòng chọn tỉnh/thành phố'),
  commune: z.string().trim().nonempty('Vui lòng chọn xã/phường'),
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
  images: z
    .object({
      newImages: z.array(
        z.object({
          file: z.instanceof(File).nullable(),
          fileName: z.string().optional(),
          previewUrl: z.string(),
        }),
      ),
      imagesToDelete: z.array(z.string()),
    })
    .refine(
      ({ newImages, imagesToDelete }) => Math.abs(newImages.length - imagesToDelete.length) > 0,
      'Ảnh không được để trống',
    ),
});

export type CreateHotelSchema = z.infer<typeof createHotelSchema>;

export const updateHotelSchema = createHotelSchema.partial();

export type UpdateHotelSchema = z.infer<typeof updateHotelSchema>;

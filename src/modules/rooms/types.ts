import { z } from 'zod';

import { BaseEntity, commonSearchParamsSchema } from '@/base/types';

import { Hotel } from '../hotels';
import { ImageResponse } from '../media';
import { RoomUtils } from './utils/room.utils';

export const roomSearchParamsSchema = commonSearchParamsSchema.extend({
  name: z.string().optional(),
  hotel: z.string().trim().optional(),
  minPrice: z.coerce
    .number()
    .nonnegative()
    .optional()
    .catch(RoomUtils.DEFAULT_MIN_PRICE)
    .default(RoomUtils.DEFAULT_MIN_PRICE),
  maxPrice: z.coerce
    .number()
    .nonnegative()
    .optional()
    .catch(RoomUtils.DEFAULT_MAX_PRICE)
    .default(RoomUtils.DEFAULT_MAX_PRICE),
  rate: z.coerce.number().int().min(0).max(5).optional().catch(undefined),
  size: z.coerce.number().int().min(0).max(5).optional().catch(undefined),
  isActive: z.enum(['all', 'true', 'false']).optional().catch('all').default('all'),
});

export type RoomSearchParams = z.infer<typeof roomSearchParamsSchema>;

export interface Room extends BaseEntity {
  name: string;
  hotel: Hotel;
  rate: number;
  size: number;
  occupancy: number;
  services: string[];
  images: ImageResponse[];
  maxQuantity: number;
  isActive: boolean;
  availability: {
    total: string;
    booked: string;
    available: string;
  };
  isSoldOut: boolean;
}

export const createRoomSchema = z.object({
  name: z.string().trim().nonempty('Tên phòng không được để trống'),
  hotel: z.string().nonempty('Vui lòng chọn 1 khách sạn'),
  rate: z.coerce.number().min(100000, 'Giá phòng tối thiểu là 100.000đ'),
  size: z.coerce.number().min(1, 'Diện tích phải là số dương'),
  occupancy: z.coerce.number().int().min(1, 'Số người tối đa phải có tối thiểu là 1'),
  services: z.array(z.string().trim()).default([]),
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
  maxQuantity: z.coerce.number().min(1, 'Số lượng phòng tối thiểu là 1'),
});

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;

export const updateRoomSchema = createRoomSchema.partial();

export type UpdateRoomSchema = z.infer<typeof updateRoomSchema>;

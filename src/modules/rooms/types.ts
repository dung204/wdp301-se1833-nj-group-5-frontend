import { z } from 'zod';

import { baseEntitySchema, commonSearchParamsSchema } from '@/base/types';

import { hotelSchema } from '../hotels';
import { imageResponseSchema } from '../media';
import { RoomUtils } from './utils/room.utils';

export const roomSearchParamsSchema = commonSearchParamsSchema.extend({
  id: z.string().optional(),
  name: z.string().optional(),
  hotel: z.string().trim().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  minOccupancy: z.coerce.number().int().min(1).catch(1).default(1),
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

export const roomSchema = baseEntitySchema.extend({
  name: z.string(),
  hotel: hotelSchema,
  rate: z.number(),
  size: z.number(),
  occupancy: z.number(),
  services: z.array(z.string()),
  images: z.array(imageResponseSchema),
  maxQuantity: z.number(),
  isActive: z.boolean(),
  availability: z.object({
    total: z.number(),
    booked: z.number(),
    available: z.number(),
  }),
  isSoldOut: z.boolean(),
});

export type Room = z.infer<typeof roomSchema>;

export const createRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty('Tên phòng không được để trống')
    .regex(/^[\p{L}\p{N}\s.,'-]+$/u, 'Tên phòng không được chứa ký tự đặc biệt'),
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

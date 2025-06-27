import { z } from 'zod';

import { BaseEntity, commonSearchParamsSchema } from '@/base/types';
import { Hotel } from '@/modules/hotels';

export const roomSearchParamsSchema = commonSearchParamsSchema.extend({
  name: z.string().optional(),
  hotel: z.string().optional(),
  rate: z.coerce.number().int().min(0).max(5).optional().catch(undefined),
  size: z.coerce.number().int().min(0).max(5).optional().catch(undefined),
});
export type RoomSearchParams = z.infer<typeof roomSearchParamsSchema>;
export interface Room extends BaseEntity {
  name: string;
  hotel: Hotel;
  rate: number;
  size: number;
  occupancy: number;
  services: string[];
  images: string[];
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
  name: z.string().min(1, 'Room name is required'),
  hotel: z.string().uuid('Hotel ID must be a valid UUID'),
  rate: z.preprocess((val) => Number(val), z.number().min(100000, 'Rate from 100.000đ')),
  size: z.preprocess((val) => Number(val), z.number().min(1, 'Size must be greater than 0')),
  occupancy: z.preprocess((val) => Number(val), z.number().min(1, 'Occupancy must be at least 1')),
  services: z.array(z.string()).default([]),
  images: z.preprocess(
    (val) =>
      typeof val === 'string'
        ? val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    z.array(z.string().url()),
  ),
  maxQuantity: z.preprocess(
    (val) => Number(val),
    z.number().min(1, 'Maximum quantity must be at least 1'),
  ),
});

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;

export const updateRoomSchema = createRoomSchema.partial();

export type UpdateRoomSchema = z.infer<typeof updateRoomSchema>;

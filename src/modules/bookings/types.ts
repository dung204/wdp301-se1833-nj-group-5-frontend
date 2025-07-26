import { addDays, format } from 'date-fns';
import { z } from 'zod';

import { baseEntitySchema, commonSearchParamsSchema } from '@/base/types';
import { CancelPolicy, hotelSchema } from '@/modules/hotels';
import { PaymentMethod } from '@/modules/payments';
import { roomSchema } from '@/modules/rooms';
import { userSchema } from '@/modules/users';

import { BookingUtils } from './utils/booking.utils';

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum BookingError {
  ROOM_FULL = 'ROOM_FULL',
  ROOM_LIMIT_EXCEEDED = 'ROOM_LIMIT_EXCEEDED',
  MIN_OCCUPANCY_NOT_MET = 'MIN_OCCUPANCY_NOT_MET',
}

export const bookingSchema = baseEntitySchema.extend({
  user: userSchema,
  hotel: hotelSchema,
  room: roomSchema,
  checkIn: z.string(),
  checkOut: z.string(),
  status: z.nativeEnum(BookingStatus),
  totalPrice: z.number(),
  quantity: z.number(),
  minOccupancy: z.number(),
  cancelPolicy: z.nativeEnum(CancelPolicy),
  discount: z.string().optional(),
  cancelledAt: z.string().optional(),
  refundAmount: z.number().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentLink: z.string().optional(),
});

export type Booking = z.infer<typeof bookingSchema>;

export const bookingsSearchParamsSchema = commonSearchParamsSchema.extend({
  id: z.string().optional(),
  userId: z.string().optional(),
  hotelId: z.string().optional(),
  roomId: z.string().optional(),
  status: z.nativeEnum(BookingStatus).optional(),
  cancelPolicy: z.nativeEnum(CancelPolicy).optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  minPrice: z.coerce
    .number()
    .nonnegative()
    .optional()
    .catch(BookingUtils.DEFAULT_MIN_PRICE)
    .default(BookingUtils.DEFAULT_MIN_PRICE),
  maxPrice: z.coerce
    .number()
    .nonnegative()
    .optional()
    .catch(BookingUtils.DEFAULT_MAX_PRICE)
    .default(BookingUtils.DEFAULT_MAX_PRICE),
  quantity: z.string().optional(),
  minOccupancy: z.string().optional(),
  hotelOwnerId: z.string().optional(),
  inFuture: z.enum(['all', 'true', 'false']).default('all'),
});

export type BookingsSearchParams = z.infer<typeof bookingsSearchParamsSchema>;

export const createBookingSchema = z.object({
  id: z.string(),
  hotel: z.string(),
  room: z.string(),
  quantity: z.coerce.number().int().min(1).optional().catch(1).default(1),
  minOccupancy: z.coerce.number().int().min(1).optional().catch(2).default(2),
  checkIn: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .catch(format(new Date(), 'yyyy-MM-dd'))
    .default(format(new Date(), 'yyyy-MM-dd')),
  checkOut: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .catch(format(addDays(new Date(), 1), 'yyyy-MM-dd'))
    .default(format(addDays(new Date(), 1), 'yyyy-MM-dd')),
  discount: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
});

export type CreateBookingSchema = z.infer<typeof createBookingSchema>;

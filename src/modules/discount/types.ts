import { z } from 'zod';

export const createDiscountSchema = z.object({
  amount: z.preprocess(
    (val) => Number(val),
    z.number().min(5, 'Amount must be a non-negative number and >= 5%'),
  ),
  maxQualityPerUser: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Max quantity must be a non-negative number'),
  ),
  usageCount: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Usage count must be a non-negative number'),
  ),
  applicableHotels: z
    .array(z.string().trim().uuid('Each hotel ID must be a valid UUID'))
    .min(1, 'Phải chọn ít nhất 1 khách sạn'), // Thêm .min(1, ...)
  expiredTimestamp: z.coerce.date().refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    { message: 'Ngày hết hạn phải lớn hơn hoặc bằng ngày hiện tại' },
  ),
  state: z.enum(['ACTIVE', 'INACTIVE']),
});

export type CreateDiscountSchema = z.infer<typeof createDiscountSchema>;

// Schema update
export const updateDiscountSchema = createDiscountSchema.partial();
export type UpdateDiscountSchema = z.infer<typeof updateDiscountSchema>;

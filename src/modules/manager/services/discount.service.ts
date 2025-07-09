import { z } from 'zod';

import { HttpClient } from '@/base/lib';
import { BaseEntity, CommonSearchParams, SuccessResponse } from '@/base/types';

import { Hotel } from './hotel.service';

// Interface chính
export interface Discount extends BaseEntity {
  amount: string;
  expiredTimestamp: Date;
  applicableHotels: Hotel[];
  maxQualityPerUser: string;
  usageCount: string;
  state: 'ACTIVE' | 'INACTIVE';
}

// Service
class DiscountService extends HttpClient {
  constructor() {
    super();
  }

  public getAllDiscount(params?: CommonSearchParams) {
    return this.get<SuccessResponse<Discount[]>>('/discounts', { params });
  }

  public getDiscountById(id: string) {
    return this.get<SuccessResponse<Discount>>(`/discounts/${id}`);
  }

  public createNewDiscount(payload: CreateDiscountSchema) {
    return this.post<SuccessResponse<Discount>>('/discounts', payload, { isPrivateRoute: true });
  }

  public updateDiscount(id: string) {
    return (payload: UpdateDiscountSchema) =>
      this.patch<SuccessResponse<Discount>>(`/discounts/${id}`, payload, { isPrivateRoute: true });
  }

  public deleteDiscount(id: string) {
    return this.delete(`/discounts/${id}`, { isPrivateRoute: true });
  }
  public restoreDiscount(id: string) {
    return this.delete(`/discounts/restore${id}`, { isPrivateRoute: true });
  }
}

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

// Export service instance
export const discountService = new DiscountService();

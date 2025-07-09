import { HttpClient } from '@/base/lib';
import { BaseEntity, CommonSearchParams, SuccessResponse } from '@/base/types';
import { Hotel } from '@/modules/hotels';

import { CreateDiscountSchema, UpdateDiscountSchema } from '../types';

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
    return this.patch(`/discounts/restore/${id}`, undefined, { isPrivateRoute: true });
  }
}

// Export service instance
export const discountService = new DiscountService();

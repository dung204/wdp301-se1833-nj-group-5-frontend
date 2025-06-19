import { HttpClient } from '@/base/lib';
import { BaseEntity, CommonSearchParams, SuccessResponse } from '@/base/types';

export interface Discount extends BaseEntity {
  amount: string;
  expiredTimestamp: Date;
  applicableHotels: string;
  maxQualityPerUser: string;
  usageCount: string;
  state: 'active' | 'inactive';
}

class DiscountService extends HttpClient {
  constructor() {
    super();
  }
  public getAllDiscount(params?: CommonSearchParams) {
    return this.get<SuccessResponse<Discount[]>>('/discounts', {
      params,
    });
  }
}
export const discountService = new DiscountService();

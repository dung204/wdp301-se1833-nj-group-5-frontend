import { z } from 'zod';

import { HttpClient } from '@/base/lib';
import { BaseEntity, CommonSearchParams, SuccessResponse } from '@/base/types';

export interface TimeRange {
  from: Date;
  to: Date;
}

export interface HotelOwner {
  id: string;
  fullName: string;
}

export interface Hotel extends BaseEntity {
  name: string;
  address: string;
  description: string;
  owner: HotelOwner;
  phoneNumber: string;
  priceHotel: string;
  cancelPolicy: 'NO_REFUND' | 'REFUND_BEFORE_1_DAY' | 'REFUND_BEFORE_3_DAYS';
  checkinTime: TimeRange;
  checkoutTime: Date;
  avatar: string[];
  rating: number;
  services: string[];
}

class HotelService extends HttpClient {
  constructor() {
    super();
  }
  public getAllHotels(params?: CommonSearchParams) {
    return this.get<SuccessResponse<Hotel[]>>('/hotels', {
      params,
    });
  }

  public getHotelById(id: string) {
    return this.get<SuccessResponse<Hotel>>(`/hotels/${id}`);
  }
  public getHotelByAdmin() {
    return this.get<SuccessResponse<Hotel>>(`/hotels/admin`, {
      isPrivateRoute: true,
    });
  }
  public createNewHotel(payload: CreateHotelSchema) {
    return this.post<SuccessResponse<Hotel>>('/hotels', payload, {
      isPrivateRoute: true,
    });
  }

  public updateHotel(id: string, payload: UpdateHotelSchema) {
    return this.patch<SuccessResponse<Hotel>>(`/hotels/${id}`, payload, {
      isPrivateRoute: true,
    });
  }

  public deleteHotel(id: string) {
    return this.delete(`/hotels/${id}`, { isPrivateRoute: true });
  }
}
export const createHotelSchema = z.object({
  name: z.string().trim().nonempty('Tên khách sạn là bắt buộc'),
  address: z.string().trim().nonempty('Địa chỉ là bắt buộc'),
  description: z.string().trim().nonempty('Mô tả là bắt buộc'),
  phoneNumber: z.string().trim().nonempty('Số điện thoại là bắt buộc'),
  priceHotel: z.preprocess((val) => Number(val), z.number().min(100000, 'Rate from 100.000đ')),
  cancelPolicy: z.enum(['NO_REFUND', 'REFUND_BEFORE_1_DAY', 'REFUND_BEFORE_3_DAYS'], {
    errorMap: () => ({ message: 'Chính sách hủy không hợp lệ' }),
  }),
  checkinTime: z.object({
    from: z.string().trim().datetime(),
    to: z.string().trim().datetime(),
  }),
  checkoutTime: z.string().trim().datetime(),
  avatar: z.array(z.string().trim()).optional(),
  services: z.array(z.string().trim()).optional(),
  rating: z.number().min(0).max(5),
});

export type CreateHotelSchema = z.infer<typeof createHotelSchema>;

export const updateHotelSchema = createHotelSchema.partial();

export type UpdateHotelSchema = z.infer<typeof updateHotelSchema>;
export const hotelService = new HotelService();

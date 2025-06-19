import { z } from 'zod';

import { HttpClient } from '@/base/lib';
import {
  BaseEntity,
  CommonSearchParams,
  SuccessResponse,
  commonSearchParamsSchema,
} from '@/base/types';

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
  checkinTime: TimeRange;
  checkoutTime: Date;
  avatar: string[];
  rating: number;
  services: string[];
}
// Schema tìm kiếm khách sạn
export const hotelSearchParamsSchema = commonSearchParamsSchema.extend({
  id: z.string().optional(),
  name: z.string().optional(),
  address: z.string().optional(),
  minRating: z.number().min(0).max(5).optional(),
  services: z.array(z.string()).optional(),
});

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
  name: z.string().nonempty('Tên khách sạn là bắt buộc'),
  address: z.string().nonempty('Địa chỉ là bắt buộc'),
  description: z.string().nonempty('Mô tả là bắt buộc'),
  phoneNumber: z.string().nonempty('Số điện thoại là bắt buộc'),
  checkinTime: z.object({
    from: z.string().datetime(),
    to: z.string().datetime(),
  }),
  checkoutTime: z.string().datetime(),
  avatar: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5),
});

export type CreateHotelSchema = z.infer<typeof createHotelSchema>;

export const updateHotelSchema = createHotelSchema.partial();

export type UpdateHotelSchema = z.infer<typeof updateHotelSchema>;
export const hotelService = new HotelService();

export type HotelSearchParams = z.infer<typeof hotelSearchParamsSchema>;

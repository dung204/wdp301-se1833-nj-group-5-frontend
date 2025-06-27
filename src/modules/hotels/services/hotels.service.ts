import { HttpClient } from '@/base/lib';
import { SuccessResponse } from '@/base/types';

import { CreateHotelSchema, Hotel, HotelSearchParams, UpdateHotelSchema } from '../types';

class HotelsService extends HttpClient {
  constructor() {
    super();
  }
  public getAllHotels(params?: HotelSearchParams) {
    return this.get<SuccessResponse<Hotel[]>>('/hotels', {
      params,
    });
  }

  public getHotelById(id: string) {
    return this.get<SuccessResponse<Hotel>>(`/hotels/${id}`);
  }
  public getHotelByAdmin(params?: HotelSearchParams) {
    return this.get<SuccessResponse<Hotel[]>>(`/hotels/admin`, {
      params,
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

export const hotelsService = new HotelsService();

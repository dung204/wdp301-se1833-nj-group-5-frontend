import { HttpClient } from '@/base/lib';
import { SuccessResponse } from '@/base/types';

import {
  CreateHotelSchema,
  Hotel,
  HotelSearchParams,
  ManagerHotelSearchParams,
  UpdateHotelSchema,
} from '../types';

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

  public getHotelByAdmin(params?: ManagerHotelSearchParams) {
    return this.get<SuccessResponse<Hotel[]>>(`/hotels/admin`, {
      params,
      isPrivateRoute: true,
    });
  }

  public createNewHotel(payload: CreateHotelSchema) {
    const {
      images: { newImages },
      ...otherPayload
    } = payload;
    const formData = new FormData();

    newImages.map(({ file }) => formData.append('images', file!));
    Object.entries(otherPayload).forEach(([key, value]) => {
      if (key === 'checkinTime') {
        formData.set(key, JSON.stringify(value));
        return;
      }

      formData.set(key, value as string);
    });

    return this.post<SuccessResponse<Hotel>>('/hotels', formData, {
      isPrivateRoute: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  public updateHotel({
    id,
    images: imagesPayload,
    ...otherPayload
  }: UpdateHotelSchema & { id: string }) {
    const formData = new FormData();

    if (imagesPayload) {
      const { newImages, imagesToDelete } = imagesPayload;

      newImages.forEach((image) => {
        if (image.file !== null && !imagesToDelete.includes(image.fileName || '')) {
          formData.append('newImages', image.file);
        }
      });

      imagesToDelete.forEach((image) => formData.append('imagesToDelete', image));
    }

    Object.entries(otherPayload).forEach(([key, value]) => {
      if (key === 'checkinTime') {
        formData.set(key, JSON.stringify(value));
        return;
      }

      formData.set(key, value as string);
    });

    return this.patch<SuccessResponse<Hotel>>(`/hotels/${id}`, formData, {
      isPrivateRoute: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  public deleteHotel(id: string) {
    return this.delete(`/hotels/${id}`, { isPrivateRoute: true });
  }
}

export const hotelsService = new HotelsService();

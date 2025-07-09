import { HttpClient } from '@/base/lib';
import { SuccessResponse } from '@/base/types';

import { CreateRoomSchema, Room, RoomSearchParams, UpdateRoomSchema } from '../types';

class RoomsService extends HttpClient {
  constructor() {
    super();
  }

  public getAllRooms(params?: RoomSearchParams) {
    return this.get<SuccessResponse<Room[]>>('/rooms', {
      params,
    });
  }
  public getRoomsByAdmin(params?: RoomSearchParams) {
    return this.get<SuccessResponse<Room[]>>('/rooms/admin', {
      params,
      isPrivateRoute: true,
    });
  }

  public getRoomById(id: string) {
    return this.get<SuccessResponse<Room>>(`/rooms/${id}`);
  }

  createNewRoom(payload: CreateRoomSchema) {
    const {
      images: { newImages },
      services,
      ...otherPayload
    } = payload;
    const formData = new FormData();

    newImages.map(({ file }) => formData.append('images', file!));

    services?.map((service) => formData.append('services', service));

    Object.entries(otherPayload).forEach(([key, value]) => {
      formData.set(key, value.toString());
    });

    return this.post<SuccessResponse<Room>>('/rooms', formData, {
      isPrivateRoute: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  public updateRoom({
    id,
    images: imagesPayload,
    services,
    ...otherPayload
  }: UpdateRoomSchema & { id: string }) {
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

    services?.map((service) => formData.append('services', service));

    Object.entries(otherPayload).forEach(([key, value]) => {
      formData.set(key, value.toString());
    });

    return this.patch<SuccessResponse<Room>>(`/rooms/${id}`, formData, {
      isPrivateRoute: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  public deleteRoom(id: string) {
    return this.delete(`/rooms/${id}`, { isPrivateRoute: true });
  }
}

export const roomsService = new RoomsService();

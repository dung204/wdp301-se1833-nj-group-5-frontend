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
    });
  }

  public getRoomById(id: string) {
    return this.get<SuccessResponse<Room>>(`/rooms/${id}`);
  }
  createNewRoom(payload: CreateRoomSchema) {
    return this.post<SuccessResponse<Room>>('/rooms', payload, { isPrivateRoute: true });
  }

  public updateRoom(id: string) {
    return (payload: UpdateRoomSchema) =>
      this.patch<SuccessResponse<Room>>(`/rooms/${id}`, payload, { isPrivateRoute: true });
  }
  public deleteRoom(id: string) {
    return this.delete(`/rooms/${id}`, { isPrivateRoute: true });
  }
}

export const roomsService = new RoomsService();

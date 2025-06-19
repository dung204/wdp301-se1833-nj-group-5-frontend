import { z } from 'zod';

import { HttpClient } from '@/base/lib';
import { BaseEntity, CommonSearchParams, SuccessResponse } from '@/base/types';

import { Hotel } from './hotel.service';

export interface Room extends BaseEntity {
  name: string;
  hotel: Hotel;
  rate: number;
  size: number;
  occupancy: number;
  services: string[];
  images: string[];
  maxQuantity: number;
  isActive: boolean;
}
class RoomService extends HttpClient {
  constructor() {
    super();
  }

  public getAllRooms(params?: CommonSearchParams) {
    return this.get<SuccessResponse<Room[]>>('/rooms', {
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
export const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  hotel: z.string().uuid('Hotel ID must be a valid UUID'),
  rate: z.number().min(0, 'Rate must be a non-negative number'),
  size: z.number().min(1, 'Size must be greater than 0'),
  occupancy: z.number().min(1, 'Occupancy must be at least 1'),
  services: z.array(z.string()).default([]),
  images: z.array(z.string().url('Must be valid image URLs')).default([]),
  maxQuantity: z.number().min(1, 'Maximum quantity must be at least 1'),
});

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;

export const updateRoomSchema = createRoomSchema.partial();

export type UpdateRoomSchema = z.infer<typeof updateRoomSchema>;
export const roomService = new RoomService();

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { roomsService } from '../services/rooms.service';
import { CreateRoomSchema, UpdateRoomSchema } from '../types';

export function useRoomMutations(options?: {
  onAddOrUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  const createRoom = useMutation({
    mutationFn: (data: CreateRoomSchema) => roomsService.createNewRoom(data),
    onSuccess: () => {
      toast.success('Thêm phòng thành công');
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      options?.onAddOrUpdateSuccess?.();
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi thêm phòng');
      console.error(error);
    },
  });

  const updateRoom = useMutation({
    mutationFn: (data: { id: string } & UpdateRoomSchema) => {
      return roomsService.updateRoom(data);
    },
    onSuccess: () => {
      toast.success('Cập nhật phòng thành công');
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      options?.onAddOrUpdateSuccess?.();
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi cập nhật phòng');
      console.error(error);
    },
  });

  const deleteRoom = useMutation({
    mutationFn: (id: string) => roomsService.deleteRoom(id),
    onSuccess: () => {
      toast.success('Xóa phòng thành công');
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      options?.onDeleteSuccess?.();
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi xóa phòng');
      console.error(error);
    },
  });

  return { createRoom, updateRoom, deleteRoom };
}

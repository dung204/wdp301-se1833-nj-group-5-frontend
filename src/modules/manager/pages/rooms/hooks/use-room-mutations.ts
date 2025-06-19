import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  CreateRoomSchema,
  UpdateRoomSchema,
  roomService,
} from '@/modules/manager/services/room.service';

export function useRoomMutations(options?: {
  onAddOrUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  const createRoom = useMutation({
    mutationFn: (data: CreateRoomSchema) => roomService.createNewRoom(data),
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
      const { id, ...payload } = data;
      return roomService.updateRoom(id)(payload);
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
    mutationFn: (id: string) => roomService.deleteRoom(id),
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

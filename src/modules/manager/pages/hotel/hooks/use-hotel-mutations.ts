import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { UpdateHotelSchema, hotelService } from '@/modules/manager/services/hotel.service';

export function useHotelMutations(options?: {
  onAddOrUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  const createHotel = useMutation({
    mutationFn: hotelService.createNewHotel,
    onSuccess: () => {
      toast.success('Thêm khách sạn thành công');
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      options?.onAddOrUpdateSuccess?.();
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi thêm khách sạn');
      console.error(error);
    },
  });

  const updateHotelMutation = useMutation({
    mutationFn: (data: { id: string } & UpdateHotelSchema) =>
      hotelService.updateHotel(data.id, data),
    onSuccess: () => {
      toast.success('Cập nhật khách sạn thành công');
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      options?.onAddOrUpdateSuccess?.();
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi cập nhật khách sạn');
      console.error(error);
    },
  });

  const deleteHotelMutation = useMutation({
    mutationFn: (id: string) => hotelService.deleteHotel(id),
    onSuccess: () => {
      toast.success('Xóa khách sạn thành công');
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      options?.onDeleteSuccess?.();
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi xóa khách sạn');
      console.error(error);
    },
  });

  return {
    createHotel,
    updateHotel: updateHotelMutation,
    deleteHotel: deleteHotelMutation,
  };
}

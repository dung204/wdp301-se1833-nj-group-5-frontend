import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { hotelsService } from '../services/hotels.service';
import { CreateHotelSchema, Hotel, UpdateHotelSchema } from '../types';

export function useHotelMutations(options?: {
  onAddOrUpdateSuccess?: (hotel: Hotel) => void;
  onDeleteSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  const createHotel = useMutation({
    mutationFn: (payload: CreateHotelSchema) => hotelsService.createNewHotel(payload),
    onSuccess: ({ data: hotel }) => {
      toast.success('Thêm khách sạn thành công');
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      options?.onAddOrUpdateSuccess?.(hotel);
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi thêm khách sạn');
      console.error(error);
    },
  });

  const updateHotelMutation = useMutation({
    mutationFn: (data: { id: string } & UpdateHotelSchema) =>
      hotelsService.updateHotel(data.id, data),
    onSuccess: ({ data: hotel }) => {
      toast.success('Cập nhật khách sạn thành công');
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      options?.onAddOrUpdateSuccess?.(hotel);
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi cập nhật khách sạn');
      console.error(error);
    },
  });

  const deleteHotelMutation = useMutation({
    mutationFn: (id: string) => hotelsService.deleteHotel(id),
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

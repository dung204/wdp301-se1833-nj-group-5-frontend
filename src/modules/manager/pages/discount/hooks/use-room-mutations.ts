import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  CreateDiscountSchema,
  UpdateDiscountSchema,
  discountService,
} from '@/modules/manager/services/discount.service';

export function useRoomMutations(options?: {
  onAddOrUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  const createDiscount = useMutation({
    mutationFn: (data: CreateDiscountSchema) => discountService.createNewDiscount(data),
    onSuccess: () => {
      toast.success('Thêm mã giảm giá thành công');
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      options?.onAddOrUpdateSuccess?.();
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi thêm phòng');
      console.error(error);
    },
  });

  const updateDiscount = useMutation({
    mutationFn: (data: { id: string } & UpdateDiscountSchema) => {
      const { id, ...payload } = data;
      return discountService.updateDiscount(id)(payload);
    },
    onSuccess: () => {
      toast.success('Cập nhật mã giảm giá thành công');
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      options?.onAddOrUpdateSuccess?.();
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi cập nhật phòng');
      console.error(error);
    },
  });

  const deleteDiscount = useMutation({
    mutationFn: (id: string) => discountService.deleteDiscount(id),
    onSuccess: () => {
      toast.success('Cập nhật mã giảm giá thành công');
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      options?.onDeleteSuccess?.();
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi xóa mã giám giá');
      console.error(error);
    },
  });

  return { createDiscount, updateDiscount, deleteDiscount };
}

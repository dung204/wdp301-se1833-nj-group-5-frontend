import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { discountService } from '../services/discount.service';
import { CreateDiscountSchema, UpdateDiscountSchema } from '../types';

export function useDiscountMutations(options?: {
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
      toast.success('Xóa mã giảm giá thành công');
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      options?.onDeleteSuccess?.();
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi xóa mã giám giá');
      console.error(error);
    },
  });

  const restoreDiscount = useMutation({
    mutationFn: (id: string) => discountService.restoreDiscount(id),
    onSuccess: () => {
      toast.success('Khôi phục mã giảm giá thành công');
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      options?.onDeleteSuccess?.();
    },
    onError: (error) => {
      toast.error(`Có lỗi xảy ra khi khôi phục mã giám giá: ${error}`);
      console.error(error);
    },
  });

  return { createDiscount, updateDiscount, deleteDiscount, restoreDiscount };
}

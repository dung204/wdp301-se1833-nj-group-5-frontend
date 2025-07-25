'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Edit, Eye, MoreHorizontal, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Pagination } from '@/base/components/layout/pagination';
import { AsyncSelect } from '@/base/components/ui/async-select';
import { Button } from '@/base/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/base/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/base/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/base/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/base/components/ui/table';
import { HotelUtils } from '@/modules/hotels/utils/hotel.utils';

import { AddEditDiscountDialog } from '../components/add-edit-discount-dialog';
import { DiscountDetailsDialog } from '../components/discount-details-dialog';
import { useDiscountMutations } from '../hooks/use-discount-mutations';
import { discountService } from '../services/discount.service';
import {
  CreateDiscountSchema,
  Discount,
  DiscountState,
  DiscountsSearchParams,
  discountStates,
} from '../types';

type ManagerDiscountsPageProps = {
  searchParams?: DiscountsSearchParams;
};

export function ManagerDiscountsPage({ searchParams }: ManagerDiscountsPageProps) {
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectHotelId, setSelectedHotelId] = useState<string>('');
  const [selectedDiscount, setSelectedDiscount] = useState<Discount>();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<Discount>();
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount>();

  const { createDiscount, updateDiscount, deleteDiscount, restoreDiscount } = useDiscountMutations({
    onAddOrUpdateSuccess: () => setAddEditDialogOpen(false),
    onDeleteSuccess: () => {
      setDeleteDialogOpen(false);
      setDiscountToDelete(undefined);
    },
  });

  const {
    data: {
      data: discounts,
      metadata: { pagination },
    },
  } = useSuspenseQuery({
    queryKey: ['discounts', 'all', searchParams],
    queryFn: () => discountService.getAllDiscounts(searchParams),
  });

  const handleDeleteDiscountClick = (discount: Discount) => {
    setDiscountToDelete(discount);
    setDeleteDialogOpen(true);
  };

  const handleRestoreDiscountClick = (discount: Discount) => {
    setDiscountToDelete(discount);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (discountToDelete?.id) {
      if (discountToDelete.deleteTimestamp) {
        restoreDiscount.mutate(discountToDelete.id);
      } else {
        deleteDiscount.mutate(discountToDelete.id);
      }
    }
  };

  const handleEditDiscountClick = (discount: Discount) => {
    setFormMode('edit');
    setEditingDiscount(discount);
    setAddEditDialogOpen(true);
  };

  const handleAddDiscountClick = () => {
    setFormMode('add');
    setEditingDiscount(undefined);
    setAddEditDialogOpen(true);
  };

  const handleDiscountSubmit = (data: CreateDiscountSchema) => {
    if (formMode === 'add') {
      createDiscount.mutate(data);
    } else if (editingDiscount?.id) {
      updateDiscount.mutate({ id: editingDiscount.id, ...data });
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý mã giảm giá</h1>
          <p className="text-gray-600">Quản lý mã giảm giá của khách sạn</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddDiscountClick}>
          <Plus />
          Thêm mã giảm giá
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
            <CardTitle>Danh sách mã giảm giá</CardTitle>
            <AsyncSelect
              {...HotelUtils.getHotelsByAdminAsyncSelectOptions('name')}
              multiple={false}
              clearable
              value={selectHotelId}
              onChange={setSelectedHotelId}
              placeholder="Tất cả khách sạn"
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Phần trăm giảm giá</TableHead>
                <TableHead>Hết hạn</TableHead>
                <TableHead>Giới hạn/người</TableHead>
                <TableHead>Lượt dùng</TableHead>
                <TableHead>Khách sạn áp dụng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>{discount.title}</TableCell>
                  <TableCell>{discount.amount}%</TableCell>
                  <TableCell>{new Date(discount.expiredTimestamp).toLocaleDateString()}</TableCell>
                  <TableCell>{discount.maxQuantityPerUser}</TableCell>
                  <TableCell>{discount.usageCount}</TableCell>
                  <TableCell>
                    <ul className="ml-4 list-disc">
                      {discount.applicableHotels.slice(0, 2).map((hotel) => (
                        <li key={hotel.id}>{hotel.name}</li>
                      ))}
                      {discount.applicableHotels.length > 2 && (
                        <span>và {discount.applicableHotels.length - 2} khách sạn khác</span>
                      )}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded px-2 py-1 text-xs text-white ${
                        discount.state === DiscountState.ACTIVE ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    >
                      {discountStates[discount.state]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDiscount(discount);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditDiscountClick(discount)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        {discount.deleteTimestamp ? (
                          <DropdownMenuItem
                            onClick={() => handleRestoreDiscountClick(discount)}
                            className="text-green-600"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Khôi phục
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleDeleteDiscountClick(discount)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="mt-4">
            <Pagination pagination={pagination} />
          </div>
        </CardContent>
      </Card>

      {/* Dialog thêm/sửa */}
      <AddEditDiscountDialog
        open={addEditDialogOpen}
        onOpenChange={setAddEditDialogOpen}
        formMode={formMode}
        discount={editingDiscount}
        onSubmit={handleDiscountSubmit}
        isPending={createDiscount.isPending || updateDiscount.isPending}
      />

      <DiscountDetailsDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        discount={selectedDiscount}
      />

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle
              className={`flex items-center gap-2 ${discountToDelete?.deleteTimestamp ? 'text-green-600' : 'text-red-600'}`}
            >
              {discountToDelete?.deleteTimestamp ? (
                <>
                  <RotateCcw className="h-5 w-5" />
                  Xác nhận khôi phục mã giảm giá
                </>
              ) : (
                <>
                  <Trash2 className="h-5 w-5" />
                  Xác nhận xóa mã giảm giá
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-gray-600">
            {discountToDelete?.deleteTimestamp ? (
              <>
                Bạn có chắc muốn <strong>khôi phục</strong> mã{' '}
                <strong>{discountToDelete?.amount}%</strong>?
              </>
            ) : (
              <>
                Bạn có chắc muốn <strong>xóa</strong> mã{' '}
                <strong>{discountToDelete?.amount}%</strong>?
              </>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteDiscount.isPending || restoreDiscount.isPending}
            >
              Hủy
            </Button>
            <Button
              variant={discountToDelete?.deleteTimestamp ? 'success' : 'danger'}
              onClick={handleConfirmDelete}
              loading={deleteDiscount.isPending || restoreDiscount.isPending}
            >
              {discountToDelete?.deleteTimestamp ? 'Khôi phục' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

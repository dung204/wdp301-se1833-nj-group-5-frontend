'use client';

import { useQuery } from '@tanstack/react-query';
import { Edit, Eye, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
import {
  CreateDiscountSchema,
  Discount,
  discountService,
} from '@/modules/manager/services/discount.service';
import { hotelService } from '@/modules/manager/services/hotel.service';

import { AddEditDiscountDialog } from './components/add-edit-room-dialog';
import { useRoomMutations } from './hooks/use-room-mutations';

// Đổi tên file này nếu cần

export function DiscountManagement() {
  const [page, setPage] = useState(1);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectHotelId, setSelectedHotelId] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<Discount | null>(null);
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);

  const { createDiscount, updateDiscount, deleteDiscount } = useRoomMutations({
    onAddOrUpdateSuccess: () => setAddEditDialogOpen(false),
    onDeleteSuccess: () => {
      setDeleteDialogOpen(false);
      setDiscountToDelete(null);
    },
  });

  const [discountFormData, setDiscountFormData] = useState<CreateDiscountSchema>({
    amount: 0,
    expiredTimestamp: new Date(),
    applicableHotels: [],
    maxQualityPerUser: 1,
    usageCount: 1,
    state: 'ACTIVE',
  });

  const pageSize = 10;

  const { data: discountData } = useQuery({
    queryKey: ['discounts', page, pageSize, selectHotelId],
    queryFn: () =>
      discountService.getAllDiscount({
        page,
        pageSize,
      }),
  });

  const { data: hotelData } = useQuery({
    queryKey: ['hotels'],
    queryFn: () => hotelService.getAllHotels(),
  });

  const handleFilterHotel = (hotelId: string) => {
    setSelectedHotelId(hotelId);
  };

  const handleConfirmDelete = () => {
    if (discountToDelete?.id) {
      deleteDiscount.mutate(discountToDelete.id);
    }
  };

  const handleDeleteDiscountClick = (discount: Discount) => {
    setDiscountToDelete(discount);
    setDeleteDialogOpen(true);
  };

  const handleEditDiscountClick = (discount: Discount) => {
    setFormMode('edit');
    setDiscountFormData({
      amount: Number(discount.amount),
      expiredTimestamp: new Date(discount.expiredTimestamp),
      applicableHotels: discount.applicableHotels.map((h) => h.id),
      maxQualityPerUser: Number(discount.maxQualityPerUser),
      usageCount: Number(discount.usageCount),
      state: discount.state,
    });
    setAddEditDialogOpen(true);
  };

  const handleAddDiscountClick = () => {
    setFormMode('add');
    setDiscountFormData({
      amount: 0,
      expiredTimestamp: new Date(),
      applicableHotels: [],
      maxQualityPerUser: 1,
      usageCount: 1,
      state: 'ACTIVE',
    });
    setAddEditDialogOpen(true);
  };

  const handleDiscountSubmit = (data: CreateDiscountSchema) => {
    if (formMode === 'add') {
      createDiscount.mutate(data);
    } else if (discountToDelete?.id) {
      updateDiscount.mutate({ id: discountToDelete.id, ...data });
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
          <Plus className="mr-2 h-4 w-4" />
          Thêm mã giảm giá
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
            <CardTitle>Danh sách mã giảm giá</CardTitle>
            <select
              onChange={(e) => handleFilterHotel(e.target.value)}
              className="rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Tất cả khách sạn</option>
              {hotelData?.data.map((hotel, index) => (
                <option key={index} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Mã giảm giá</TableHead>
                <TableHead>Hết hạn</TableHead>
                <TableHead>Giới hạn/người</TableHead>
                <TableHead>Lượt dùng</TableHead>
                <TableHead>Khách sạn áp dụng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discountData?.data.map((discount, index) => (
                <TableRow key={discount.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{discount.amount}%</TableCell>
                  <TableCell>{new Date(discount.expiredTimestamp).toLocaleDateString()}</TableCell>
                  <TableCell>{discount.maxQualityPerUser}</TableCell>
                  <TableCell>{discount.usageCount}</TableCell>
                  <TableCell>
                    <ul className="ml-4 list-disc">
                      {discount.applicableHotels.map((hotel) => (
                        <li key={hotel.id}>{hotel.name}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded px-2 py-1 text-xs text-white ${
                        discount.state === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    >
                      {discount.state}
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditDiscountClick(discount)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteDiscountClick(discount)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {discountData && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Trang {discountData.metadata.pagination.currentPage} /{' '}
                {discountData.metadata.pagination.totalPage}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!discountData.metadata.pagination.hasPreviousPage}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Trang trước
                </Button>
                {Array.from(
                  { length: discountData.metadata.pagination.totalPage },
                  (_, i) => i + 1,
                ).map((num) => (
                  <Button
                    key={num}
                    variant={
                      num === discountData.metadata.pagination.currentPage ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!discountData.metadata.pagination.hasNextPage}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Trang sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog thêm/sửa */}
      <AddEditDiscountDialog
        open={addEditDialogOpen}
        onOpenChange={setAddEditDialogOpen}
        formMode={formMode}
        defaultValues={discountFormData}
        onSubmit={handleDiscountSubmit}
        isPending={createDiscount.isPending || updateDiscount.isPending}
        hotels={hotelData?.data || []}
      />

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Xác nhận xóa mã giảm giá
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-gray-600">
            Bạn có chắc muốn xóa mã <strong>{discountToDelete?.amount}%</strong>?
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteDiscount.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={deleteDiscount.isPending}
            >
              {deleteDiscount.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

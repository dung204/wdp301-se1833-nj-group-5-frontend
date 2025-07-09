'use client';

import { useQuery } from '@tanstack/react-query';
import { Edit, Eye, MoreHorizontal, Plus, RotateCcw, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Badge } from '@/base/components/ui/badge';
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
import { hotelsService } from '@/modules/hotels';

import { AddEditDiscountDialog } from '../components/add-edit-room-dialog';
import { useDiscountMutations } from '../hooks/use-discount-mutations';
import { Discount, discountService } from '../services/discount.service';
import { CreateDiscountSchema } from '../types';

// Đổi tên file này nếu cần

export function DiscountManagement() {
  const [page, setPage] = useState(1);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectHotelId, setSelectedHotelId] = useState<string>('');
  const [selectDiscount, setSelectDiscount] = useState<Discount | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<Discount | null>(null);
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const { createDiscount, updateDiscount, deleteDiscount, restoreDiscount } = useDiscountMutations({
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
    queryFn: () => hotelsService.getAllHotels(),
  });

  const handleFilterHotel = (hotelId: string) => {
    setSelectedHotelId(hotelId);
  };
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
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectDiscount(discount);
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

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[95vh] max-w-3xl overflow-y-auto p-0">
          <div className="flex h-full flex-col">
            {/* Header */}
            <DialogHeader className="rounded-t-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="rounded-full bg-white/20 p-2">
                  <Eye className="h-5 w-5" />
                </div>
                Thông tin chi tiết mã giảm giá
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6">
              {selectDiscount && (
                <div className="space-y-6">
                  {/* Mức giảm giá & trạng thái */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Giảm {selectDiscount.amount}%
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Hạn sử dụng:{' '}
                        <span className="font-medium text-red-600">
                          {new Date(selectDiscount.expiredTimestamp).toLocaleDateString('vi-VN')}
                        </span>
                      </p>
                    </div>
                    <Badge
                      className={
                        selectDiscount.state === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-200 text-gray-600'
                      }
                    >
                      {selectDiscount.state === 'ACTIVE' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                    </Badge>
                  </div>

                  {/* Số lượng sử dụng và giới hạn */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Card className="p-4 text-center">
                      <div className="text-sm text-gray-500">Số lần đã dùng</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {selectDiscount.usageCount}
                      </div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-sm text-gray-500">Giới hạn người dùng</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {selectDiscount.maxQualityPerUser}
                      </div>
                    </Card>
                  </div>

                  {/* Danh sách khách sạn áp dụng */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">
                      Áp dụng cho khách sạn
                    </h3>
                    <ul className="space-y-2">
                      {selectDiscount.applicableHotels.length > 0 ? (
                        selectDiscount.applicableHotels.map((hotel) => (
                          <li
                            key={hotel.id}
                            className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"
                          >
                            <Image
                              src={hotel?.images[0].url}
                              alt={hotel.name}
                              className="h-12 w-12 rounded object-cover"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">{hotel.name}</p>
                              <p className="text-sm text-gray-500">{hotel.address}</p>
                            </div>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">Không áp dụng cho khách sạn nào</p>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <DialogFooter className="border-t bg-gray-50 p-6">
              <div className="flex w-full justify-end">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Đóng
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

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
              disabled={deleteDiscount.isPending || restoreDiscount.isPending}
            >
              {deleteDiscount.isPending || restoreDiscount.isPending
                ? discountToDelete?.deleteTimestamp
                  ? 'Đang khôi phục...'
                  : 'Đang xóa...'
                : discountToDelete?.deleteTimestamp
                  ? 'Khôi phục'
                  : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

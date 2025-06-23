'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  Clock,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Plus,
  Star,
  Trash2,
  User,
} from 'lucide-react';
// import { Hotel, hotelService, CreateHotelSchema, } from "@/modules/users/services/hotel.service"
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
import { Label } from '@/base/components/ui/label';
import { Separator } from '@/base/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/base/components/ui/table';
import { CreateHotelSchema, Hotel, hotelService } from '@/modules/manager/services/hotel.service';

import { AddEditDialog } from './components/add-edit-dialog';
import { useHotelMutations } from './hooks/use-hotel-mutations';

export function HotelManagement() {
  // const [hotels, setHotels] = useState<Hotel[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editOrAddDialogOpen, setEditOrAddDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState<Hotel | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  // Update query to use searchParams
  const { data: hotelData, isLoading } = useQuery({
    queryKey: ['hotels', page, pageSize],
    queryFn: () =>
      hotelService.getAllHotels({
        page,
        pageSize,
      }),
  });

  // Add mutation
  const { createHotel, updateHotel, deleteHotel } = useHotelMutations({
    onAddOrUpdateSuccess: () => setEditOrAddDialogOpen(false),
    onDeleteSuccess: () => {
      setDeleteDialogOpen(false);
      setHotelToDelete(null);
    },
  });
  const isPending = createHotel.isPending || deleteHotel.isPending;
  const isUpdating = updateHotel.isPending;

  const [hotelFormData, setHotelFormData] = useState<Hotel>({
    id: '',
    name: '',
    address: '',
    description: '',
    owner: { id: '', fullName: '' },
    phoneNumber: '',
    checkinTime: { from: new Date(), to: new Date() },
    avatar: [],
    checkoutTime: new Date(),
    rating: 5,
    services: [],
    createTimestamp: '',
    deleteTimestamp: null,
  });

  const handleAddHotelClick = () => {
    setFormMode('add');
    setHotelFormData({
      id: '',
      name: '',
      address: '',
      description: '',
      owner: { id: '', fullName: '' },
      phoneNumber: '',
      checkinTime: { from: new Date(), to: new Date() },
      avatar: [],
      checkoutTime: new Date(),
      rating: 5,
      services: [],
      createTimestamp: '',
      deleteTimestamp: null,
    });
    setEditOrAddDialogOpen(true);
  };
  const handleEditClick = (hotel: Hotel) => {
    setFormMode('edit');
    setHotelFormData({
      ...hotel,
      checkinTime: {
        from: new Date(hotel.checkinTime.from),
        to: new Date(hotel.checkinTime.to),
      },
      checkoutTime: new Date(hotel.checkoutTime),
    });
    setEditOrAddDialogOpen(true);
  };

  const handleViewClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setViewDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (hotelToDelete?.id) {
      deleteHotel.mutate(hotelToDelete.id);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmit = () => {
    const payload: CreateHotelSchema = {
      name: hotelFormData.name,
      address: hotelFormData.address,
      description: hotelFormData.description,
      phoneNumber: hotelFormData.phoneNumber,
      checkinTime: {
        from: hotelFormData.checkinTime.from.toISOString(),
        to: hotelFormData.checkinTime.to.toISOString(),
      },
      checkoutTime: hotelFormData.checkoutTime.toISOString(),
      avatar: hotelFormData.avatar,
      services: hotelFormData.services,
      rating: hotelFormData.rating,
    };

    if (formMode === 'add') {
      createHotel.mutate(payload);
    } else {
      updateHotel.mutate({ id: hotelFormData.id, ...payload });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <Building2 className="h-8 w-8 text-blue-600" />
            Quản lý khách sạn
          </h1>
          <p className="mt-1 text-gray-600">Quản lý thông tin khách sạn và dịch vụ</p>
        </div>
        <Button onClick={handleAddHotelClick} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Thêm khách sạn
        </Button>
      </div>
      {/* <Card>
        <CardContent className="space-y-4 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label>Tìm theo tên</Label>
              <Input
                placeholder="Nhập tên khách sạn..."
              onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div>
              <Label>Địa chỉ</Label>
              <Input
                placeholder="Nhập địa chỉ..."
              onChange={(e) => handleAddressFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng khách sạn</p>
                <p className="text-2xl font-bold text-gray-900">{hotelData?.data.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{hotelData?.data.length}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <div className="h-3 w-3 rounded-full bg-green-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách sạn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {/* <TableHead className="font-semibold">#</TableHead> */}
                  <TableHead className="font-semibold">Tên khách sạn</TableHead>
                  <TableHead className="font-semibold">Địa chỉ</TableHead>
                  <TableHead className="font-semibold">Chủ sở hữu</TableHead>
                  <TableHead className="font-semibold">Check-in</TableHead>
                  <TableHead className="font-semibold">Check-out</TableHead>
                  <TableHead className="text-center font-semibold">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotelData?.data.map((hotel) => (
                  <TableRow key={hotel.id} className="hover:bg-gray-50">
                    {/* <TableCell className="font-medium">{(page - 1) * PAGE_SIZE + index + 1}</TableCell> */}
                    <TableCell>
                      <div className="font-medium text-gray-900">{hotel.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span className="max-w-[200px] truncate">{hotel.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-600">
                        <User className="mr-1 h-4 w-4" />
                        {hotel.owner.fullName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-600">
                        <Clock className="mr-1 h-4 w-4" />
                        <span className="text-sm">
                          {formatTime(hotel.checkinTime.from)} - {formatTime(hotel.checkinTime.to)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-600">
                        <Clock className="mr-1 h-4 w-4" />
                        <span className="text-sm">{formatTime(hotel.checkoutTime)}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleViewClick(hotel)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClick(hotel)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setHotelToDelete(hotel);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600 focus:text-red-600"
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
          </div>
          {hotelData && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Trang {hotelData.metadata.pagination.currentPage} /{' '}
                {hotelData.metadata.pagination.totalPage}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hotelData.metadata.pagination.hasPreviousPage}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Trang trước
                </Button>

                {/* Hiển thị số trang */}
                {Array.from(
                  { length: hotelData.metadata.pagination.totalPage },
                  (_, i) => i + 1,
                ).map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={
                      pageNumber === hotelData.metadata.pagination.currentPage
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hotelData.metadata.pagination.hasNextPage}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Trang sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Add/Edit Dialog */}
      <AddEditDialog
        open={editOrAddDialogOpen}
        onOpenChange={setEditOrAddDialogOpen}
        formMode={formMode}
        hotelFormData={hotelFormData}
        setHotelFormData={setHotelFormData}
        onSubmit={handleSubmit}
        isPending={isPending || isUpdating}
      />

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="max-h-[95vh] w-screen max-w-[90vw] overflow-y-auto p-0"
        >
          <DialogHeader className="rounded-t-lg bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="rounded-full bg-white/20 p-2">
                <Eye className="h-5 w-5" />
              </div>
              Thông tin chi tiết khách sạn
            </DialogTitle>
            {/* <DialogDescription>Thông tin chi tiết về khách sạn.</DialogDescription> */}
          </DialogHeader>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedHotel && (
              <div className="space-y-6">
                <div className="space-y-6">
                  {/* Ảnh khách sạn (chiếm toàn bộ chiều ngang) */}
                  <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-lg">
                    {Array.isArray(selectedHotel.avatar) && selectedHotel.avatar[0] ? (
                      <Image
                        src={selectedHotel.avatar[0]}
                        alt={selectedHotel.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                        Không có ảnh
                      </div>
                    )}
                  </div>

                  {/* Thông tin khách sạn */}
                  <div className="space-y-4 px-2">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedHotel.name}</h2>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-semibold">{selectedHotel.rating}</span>
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Đang hoạt động
                        </Badge>
                      </div>
                    </div>

                    {/* Địa chỉ */}
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin className="mt-0.5 h-5 w-5 text-emerald-600" />
                      <p>{selectedHotel.address}</p>
                    </div>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <User className="h-5 w-5 text-gray-600" />
                      Chủ sở hữu:
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{selectedHotel.owner.fullName}</p>
                      </div>
                    </h3>
                    <div className="space-y-3"></div>
                  </div>
                </div>

                <Separator />
                <Card>
                  <CardContent className="p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <Clock className="h-5 w-5 text-gray-600" />
                      Giờ hoạt động
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Check-in</Label>
                          <p className="font-semibold text-blue-700">
                            {formatTime(selectedHotel.checkinTime.from)} -{' '}
                            {formatTime(selectedHotel.checkinTime.to)}
                          </p>
                        </div>
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Check-out</Label>
                          <p className="font-semibold text-orange-700">
                            {formatTime(selectedHotel.checkoutTime)}
                          </p>
                        </div>
                        <Clock className="h-5 w-5 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Amenities */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      Tiện nghi khách sạn
                    </h3>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {selectedHotel.services.map((amenity, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                        >
                          <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Mô tả khách sạn</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="leading-relaxed text-gray-700">
                        {selectedHotel.description || 'Không có mô tả'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="border-t bg-gray-50 p-6">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Cập nhật lần cuối: Hôm nay</span>
                <Badge variant="outline" className="border-green-600 text-green-600">
                  Đã xác thực
                </Badge>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Xác nhận xóa khách sạn
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Bạn có chắc chắn muốn xóa khách sạn{' '}
              <span className="font-semibold text-gray-900">{hotelToDelete?.name}</span> không?
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? 'Đang xóa...' : 'Xóa khách sạn'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

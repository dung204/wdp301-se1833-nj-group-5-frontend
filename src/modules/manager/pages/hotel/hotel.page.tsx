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
  Trash2,
  User,
} from 'lucide-react';
// import { Hotel, hotelService, CreateHotelSchema, } from "@/modules/users/services/hotel.service"
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
import { Input } from '@/base/components/ui/input';
import { Label } from '@/base/components/ui/label';
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
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editOrAddDialogOpen, setEditOrAddDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState<Hotel | null>(null);

  // Update query to use searchParams
  const { data: hotelData, isLoading } = useQuery({
    queryKey: ['hotels'],
    queryFn: () => hotelService.getAllHotels(),
  });

  useEffect(() => {
    if (hotelData?.data) {
      setHotels(hotelData.data);
    }
  }, [hotelData]);

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
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search by name */}
            <div>
              <Label>Tìm theo tên</Label>
              <Input
                placeholder="Nhập tên khách sạn..."
                // onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Filter by address */}
            <div>
              <Label>Địa chỉ</Label>
              <Input
                placeholder="Nhập địa chỉ..."
                // onChange={(e) => handleAddressFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng khách sạn</p>
                <p className="text-2xl font-bold text-gray-900">{hotels.length}</p>
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
                <p className="text-2xl font-bold text-green-600">{hotels.length}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <div className="h-3 w-3 rounded-full bg-green-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Trang hiện tại</p>
                <p className="text-2xl font-bold text-gray-900">{/* {page}/{totalPages} */}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                {/* <span className="text-sm font-medium text-gray-600">{page}</span> */}
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
                {hotels.map((hotel) => (
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

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Thông tin khách sạn
            </DialogTitle>
          </DialogHeader>
          {selectedHotel && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Tên khách sạn</Label>
                    <p className="text-lg font-semibold">{selectedHotel.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Chủ sở hữu</Label>
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {selectedHotel.owner.fullName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Địa chỉ</Label>
                    <p className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                      {selectedHotel.address}
                    </p>
                  </div>

                  <div className="relative h-48 w-full flex-shrink-0 sm:w-64">
                    <Image
                      src={
                        Array.isArray(selectedHotel.avatar)
                          ? selectedHotel.avatar[0]
                          : selectedHotel.avatar
                      }
                      alt={selectedHotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Giờ check-in</Label>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {formatTime(selectedHotel.checkinTime.from)} -{' '}
                      {formatTime(selectedHotel.checkinTime.to)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Giờ check-out</Label>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {formatTime(selectedHotel.checkoutTime)}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Mô tả</Label>
                <p className="mt-1 rounded-lg bg-gray-50 p-3 text-gray-900">
                  {selectedHotel.description || 'Không có mô tả'}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Đóng</Button>
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

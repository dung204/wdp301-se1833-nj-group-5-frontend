'use client';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import {
  Badge,
  Banknote,
  Building2,
  DollarSign,
  Edit,
  Eye,
  FilterIcon,
  MapPin,
  Maximize,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  Trash2,
  User,
  Users,
  UsersRound,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
import { Input } from '@/base/components/ui/input';
import { Select } from '@/base/components/ui/select';
import { Separator } from '@/base/components/ui/separator';
import { Slider } from '@/base/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/base/components/ui/table';
import { Hotel, hotelsService } from '@/modules/hotels';
import { CreateRoomSchema, Room, roomService } from '@/modules/manager/services/room.service';

import { AddEditRoomDialog } from '../components/add-edit-room-dialog';
import { useRoomMutations } from '../hooks/use-room-mutations';
import { RoomSearchParams } from '../types';
import { RoomUtils } from '../utils/room.utils';

type RoomsPageProps = {
  searchParams: RoomSearchParams;
};
export function RoomManagement({ searchParams }: RoomsPageProps) {
  const [page, setPage] = useState(searchParams?.page || 1);

  const mergedSearchParams = { ...searchParams, page };
  const {
    data: {
      data: rooms,
      metadata: { pagination },
    },
  } = useSuspenseQuery({
    queryKey: ['hotels', 'all', mergedSearchParams],
    queryFn: () => roomService.getRoomsByAdmin(mergedSearchParams),
  });
  const { data: hotelData } = useQuery({
    queryKey: ['hotels'],
    queryFn: () => hotelsService.getHotelByAdmin(),
  });
  const router = useRouter();
  const [name, setName] = useState(searchParams.name ?? '');
  const [minRate, setMinRate] = useState(searchParams.minRate ?? RoomUtils.DEFAULT_MIN_PRICE);
  const [maxRate, setMaxRate] = useState(searchParams.maxRate ?? RoomUtils.DEFAULT_MAX_PRICE);
  const [hotel, setHotel] = useState(searchParams.hotel ?? '');
  const handleApplyFilters = () => {
    const url = new URL(window.location.href);
    if (name !== '') {
      url.searchParams.set('name', name);
    } else {
      url.searchParams.delete('name');
    }
    url.searchParams.set('minRate', minRate.toString());
    url.searchParams.set('maxRate', maxRate.toString());
    if (hotel) {
      url.searchParams.set('hotel', hotel);
    } else {
      url.searchParams.delete('hotel');
    }
    router.push(url.href);
  };
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const { createRoom, updateRoom, deleteRoom } = useRoomMutations({
    onAddOrUpdateSuccess: () => setAddEditDialogOpen(false),
    onDeleteSuccess: () => {
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
    },
  });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [roomFormData, setRoomFormData] = useState<CreateRoomSchema>({
    name: '',
    hotel: '',
    rate: 0,
    size: 0,
    occupancy: 1,
    services: [],
    images: [],
    maxQuantity: 1,
  });

  const handleAddRoomClick = () => {
    setFormMode('add');
    setRoomFormData({
      name: '',
      hotel: '',
      rate: 0,
      size: 0,
      occupancy: 1,
      services: [],
      images: [],
      maxQuantity: 1,
    });
    setAddEditDialogOpen(true);
  };

  const handleEditRoomClick = (room: Room) => {
    setFormMode('edit');
    setEditingRoom(room);
    setRoomFormData({
      name: room.name,
      hotel: room.hotel.id,
      rate: room.rate,
      size: room.size,
      occupancy: room.occupancy,
      services: room.services,
      images: room.images,
      maxQuantity: room.maxQuantity,
    });
    setAddEditDialogOpen(true);
  };

  const handleDeleteRoomClick = (room: Room) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (roomToDelete?.id) {
      deleteRoom.mutate(roomToDelete.id);
    }
  };

  const handleSubmit = (values: CreateRoomSchema) => {
    if (formMode === 'add') {
      createRoom.mutate(values);
    } else if (formMode === 'edit' && editingRoom) {
      updateRoom.mutate({ id: editingRoom.id, ...values });
    }
  };
  const [selectHotelId, setSelectedHotelId] = useState<string>('');
  const filterRooms = rooms.filter((room) =>
    selectHotelId ? room.hotel.id === selectHotelId : true,
  );
  // Thêm handler cho việc thay đổi hotel
  const handleFilterHotel = (hotelId: string) => {
    setSelectedHotelId(hotelId);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <Building2 className="h-8 w-8 text-blue-600" />
            Quản lý phòng
          </h1>
          <p className="mt-1 text-gray-600">Quản lý phòng của khách sạn</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddRoomClick}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm phòng
        </Button>
      </div>
      <Card className="mx-auto w-full border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <div className="h-6 w-1 rounded-full bg-blue-500"></div>
            Bộ Lọc tìm kiếm
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Search Section */}
              <div className="space-y-3">
                <div className="text-base font-semibold text-gray-700">Tìm kiếm</div>
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Tìm kiếm phòng..."
                    className="border-gray-200 pl-10 transition-colors focus:border-blue-500 focus:ring-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Price Range Section */}
              <div className="space-y-4">
                <div className="text-base font-semibold text-gray-700">Khoảng giá</div>

                <div className="px-3">
                  <Slider
                    defaultValue={[50]}
                    value={[minRate, maxRate]}
                    max={RoomUtils.DEFAULT_MAX_PRICE}
                    step={50000}
                    onValueChange={(value) => {
                      setMinRate(value[0]);
                      setMaxRate(value[1]);
                    }}
                  />
                </div>

                <div className="flex justify-between px-3 text-xs font-medium tracking-wide text-gray-500 uppercase">
                  <span>Tối thiểu</span>
                  <span>Tối đa</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      value={minRate.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                      readOnly
                      className="border-gray-200 bg-gray-50 text-center font-medium"
                    />
                  </div>
                  <div className="">-</div>
                  <div className="flex-1">
                    <Input
                      value={maxRate.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                      readOnly
                      className="border-gray-200 bg-gray-50 text-center font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="text-base font-semibold text-gray-700">Khách sạn</div>
                <Select
                  multiple={false}
                  options={
                    hotelData?.data
                      ? hotelData.data.map((hotel: Hotel) => ({
                          value: hotel.id,
                          label: hotel.name,
                        }))
                      : []
                  }
                  placeholder="Chọn khách sạn..."
                  searchable={false}
                  value={hotel}
                  onChange={(value) => setHotel(value)}
                />
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-700">
                  💡 Mẹo: Sử dụng bộ lọc để tìm kiếm chính xác hơn
                </p>
              </div>
              {(name || hotel || minRate > 100000 || maxRate < RoomUtils.DEFAULT_MAX_PRICE) && (
                <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h4 className="mb-2 text-center font-semibold text-gray-700">
                    Bộ lọc đang áp dụng:
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {name && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                        Tìm kiếm: {name}
                      </span>
                    )}
                    {hotel && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                        Khách sạn: {hotelData?.data.find((h) => h.id === hotel)?.name}
                      </span>
                    )}
                    {(minRate > 100000 || maxRate < RoomUtils.DEFAULT_MAX_PRICE) && (
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                        Giá:{' '}
                        {minRate.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}{' '}
                        -{' '}
                        {maxRate.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button onClick={handleApplyFilters} className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4" />
              Áp dụng bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
            <CardTitle>Danh sách khách sạn</CardTitle>

            <div className="justify-self-start sm:justify-self-end">
              <select
                onChange={(e) => handleFilterHotel(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Tất cả khách sạn</option>
                {hotelData?.data.map((hotel, idx) => (
                  <option key={idx} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Tên phòng</TableHead>
                  <TableHead className="font-semibold">Khách sạn</TableHead>
                  <TableHead className="font-semibold">Chủ sở hữu</TableHead>
                  <TableHead className="font-semibold">Giá</TableHead>
                  <TableHead className="font-semibold">Số lượng người</TableHead>
                  <TableHead className="font-semibold">Số lượng tối đa</TableHead>
                  <TableHead className="font-semibold">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterRooms?.map((room) => (
                  <TableRow key={room.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-medium text-gray-900">{room.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span className="max-w-[200px] truncate">{room.hotel?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-600">
                        <User className="mr-1 h-4 w-4" />
                        {room.hotel?.owner?.fullName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-600">
                        <Banknote className="mr-1 h-4 w-4" />
                        <span className="text-sm">
                          {room.rate.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-600">
                        <UsersRound className="mr-1 h-4 w-4" />
                        <span className="text-sm">{room.occupancy}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-600">
                        <UsersRound className="mr-1 h-4 w-4" />
                        <span className="text-sm">{room.maxQuantity}</span>
                      </div>
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
                              setSelectedRoom(room);
                              setViewDialogOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Chi tiết
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => handleEditRoomClick(room)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleDeleteRoomClick(room)}
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

          {/* Pagination */}
          {rooms && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Trang {pagination.currentPage} / {pagination.totalPage}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Trang trước
                </Button>

                {/* Hiển thị số trang */}
                {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === pagination.currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
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
      <AddEditRoomDialog
        open={addEditDialogOpen}
        onOpenChange={setAddEditDialogOpen}
        formMode={formMode}
        defaultValues={roomFormData}
        onSubmit={handleSubmit}
        isPending={createRoom.isPending || updateRoom.isPending}
        hotels={hotelData?.data || []}
      />

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[95vh] max-w-4xl overflow-y-auto p-0">
          <div className="flex h-full flex-col">
            {/* Header with gradient background */}
            <DialogHeader className="rounded-t-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="rounded-full bg-white/20 p-2">
                  <Eye className="h-5 w-5" />
                </div>
                Thông tin chi tiết phòng
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedRoom && (
                <div className="space-y-6">
                  {/* Room title and rating */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="mb-2 text-2xl font-bold text-gray-900">{selectedRoom.name}</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{selectedRoom.rate}</span>
                        <span>• Đánh giá xuất sắc</span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 px-3 py-1 text-green-800">Còn trống</Badge>
                  </div>

                  {/* Hotel info card */}
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <h3 className="">
                        Thuộc sở hữu của:{' '}
                        <span className="mb-2 font-semibold text-gray-900">
                          {' '}
                          {selectedRoom.hotel.name}
                        </span>
                      </h3>
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="mt-0.5 h-4 w-4 text-blue-500" />
                        <span className="text-sm">{selectedRoom.hotel.address}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Room details grid */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="p-4 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="mb-1 text-2xl font-bold text-gray-900">
                        {selectedRoom.rate.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">VNĐ / đêm</div>
                    </Card>

                    <Card className="p-4 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Maximize className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="mb-1 text-2xl font-bold text-gray-900">
                        {selectedRoom.size}
                      </div>
                      <div className="text-sm text-gray-600">m² diện tích</div>
                    </Card>

                    <Card className="p-4 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="mb-1 text-2xl font-bold text-gray-900">
                        {selectedRoom.occupancy}
                      </div>
                      <div className="text-sm text-gray-600">người tối đa</div>
                    </Card>
                  </div>
                  <Separator />
                  {/* Services */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Dịch vụ bao gồm</h3>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {selectedRoom.services && selectedRoom.services.length > 0 ? (
                        selectedRoom.services.map((service, idx) => (
                          <div
                            key={`${service}-${idx}`}
                            className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                          >
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-gray-700">{service}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 italic">Không có dịch vụ đặc biệt</div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Hình ảnh phòng</h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {(Array.isArray(selectedRoom.images)
                        ? selectedRoom.images
                        : [selectedRoom.images]
                      ).map((img, idx) => (
                        <div
                          key={idx}
                          className="group relative aspect-square overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-lg"
                        >
                          <Image
                            src={img || '/placeholder.svg'}
                            alt={`Ảnh phòng ${idx + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <DialogFooter className="border-t bg-gray-50 p-6">
              <div className="flex w-full items-center justify-between">
                <div className="text-sm text-gray-600">Giá đã bao gồm thuế và phí dịch vụ</div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                    Đóng
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">Đặt phòng ngay</Button>
                </div>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Xác nhận xóa phòng
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Bạn có chắc chắn muốn xóa phòng{' '}
              <span className="font-semibold text-gray-900">{roomToDelete?.name}</span> không?
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteRoom.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={deleteRoom.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteRoom.isPending ? 'Đang xóa...' : 'Xóa phòng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

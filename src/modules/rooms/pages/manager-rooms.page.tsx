'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
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
  Star,
  Trash2,
  User,
  Users,
  UsersRound,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';

import { Pagination } from '@/base/components/layout/pagination';
import { Button } from '@/base/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/base/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/base/components/ui/carousel';
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
import { Form } from '@/base/components/ui/form';
import { Select } from '@/base/components/ui/select';
import { Separator } from '@/base/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/base/components/ui/table';
import { StringUtils } from '@/base/utils';
import { HotelUtils } from '@/modules/hotels/utils/hotel.utils';

import { AddEditRoomDialog } from '../components/add-edit-room-dialog';
import { useRoomMutations } from '../hooks/use-room-mutations';
import { roomsService } from '../services/rooms.service';
import { CreateRoomSchema, Room, RoomSearchParams } from '../types';
import { RoomUtils } from '../utils/room.utils';

const roomFilterSchema = z.object({
  name: z.string().optional(),
  hotel: z.string().optional(),
  price: z.tuple([
    z.coerce.number().min(RoomUtils.DEFAULT_MIN_PRICE, 'Giá tối thiểu không hợp lệ'),
    z.coerce.number().max(RoomUtils.DEFAULT_MAX_PRICE, 'Giá tối đa không hợp lệ'),
  ]),
});

type RoomsPageProps = {
  searchParams: RoomSearchParams;
};

export function ManagerRoomsPage({ searchParams }: RoomsPageProps) {
  const router = useRouter();

  const {
    data: {
      data: rooms,
      metadata: { pagination },
    },
  } = useSuspenseQuery({
    queryKey: ['rooms', 'all', searchParams],
    queryFn: () => roomsService.getRoomsByAdmin(searchParams),
  });

  const { createRoom, updateRoom, deleteRoom } = useRoomMutations({
    onAddOrUpdateSuccess: () => setAddEditDialogOpen(false),
    onDeleteSuccess: () => {
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
    },
  });

  const handleApplyFilters = (payload: z.infer<typeof roomFilterSchema>) => {
    const {
      name,
      hotel,
      price: [minPrice, maxPrice],
    } = payload;

    const url = new URL(window.location.href);

    if (name) {
      url.searchParams.set('name', name);
    } else {
      url.searchParams.delete('name');
    }

    url.searchParams.set('minRate', minPrice.toString());
    url.searchParams.set('maxRate', maxPrice.toString());

    if (hotel) {
      url.searchParams.set('hotel', hotel);
    } else {
      url.searchParams.delete('hotel');
    }

    router.push(url.href);
  };

  const handleFilterActive = (value: string | undefined) => {
    const url = new URL(window.location.href);

    if (value) {
      url.searchParams.set('isActive', value);
    } else {
      url.searchParams.delete('isActive');
    }

    router.push(url.href);
  };

  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const [editingRoom, setEditingRoom] = useState<Room>();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleAddRoomClick = () => {
    setFormMode('add');
    setEditingRoom(undefined);
    setAddEditDialogOpen(true);
  };

  const handleEditRoomClick = (room: Room) => {
    setFormMode('edit');
    setEditingRoom(room);
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
          <Plus />
          Thêm phòng
        </Button>
      </div>
      <Card className="mx-auto w-full border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <div className="h-6 w-1 rounded-full bg-blue-500"></div>
            Bộ lọc tìm kiếm
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <Form
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
            schema={roomFilterSchema}
            defaultValues={{
              name: searchParams.name,
              hotel: searchParams.hotel,
              price: [searchParams.minPrice, searchParams.maxPrice],
            }}
            fields={[
              {
                name: 'name',
                type: 'text',
                label: 'Tên phòng',
                placeholder: 'Tìm kiếm phòng...',
                className: 'self-baseline',
                render: ({ Label, Control }) => (
                  <>
                    <Label className="text-base font-semibold text-gray-700" />
                    <Control />
                  </>
                ),
              },
              {
                name: 'hotel',
                type: 'select',
                async: true,
                ...HotelUtils.getHotelsByAdminAsyncSelectOptions('name'),
                multiple: false,
                clearable: true,
                className: 'self-baseline',
                render: ({ Label, Control }) => (
                  <>
                    <Label className="text-base font-semibold text-gray-700" />
                    <Control />
                  </>
                ),
              },
              {
                name: 'price',
                type: 'slider',
                label: 'Khoảng giá',
                required: false,
                range: true,
                min: RoomUtils.DEFAULT_MIN_PRICE,
                max: RoomUtils.DEFAULT_MAX_PRICE,
                step: RoomUtils.PRICE_RANGE,
                className: 'space-y-4',
                numberFormat: (value) => StringUtils.formatCurrency(value.toString()),
                render: ({ Label, Control }) => (
                  <>
                    <Label className="text-base font-semibold text-gray-700" />
                    <Control />
                  </>
                ),
              },
            ]}
            renderSubmitButton={(Button) => (
              <div className="col-span-3 flex items-center justify-center">
                <Button>
                  <FilterIcon />
                  Áp dụng bộ lọc
                </Button>
              </div>
            )}
            onSuccessSubmit={handleApplyFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Danh sách phòng</CardTitle>
          <Select
            triggerClassName="w-48"
            options={[
              { value: 'all', label: 'Tất cả' },
              { value: 'true', label: 'Đang hoạt động' },
              { value: 'false', label: 'Ngừng hoạt động' },
            ]}
            clearable={false}
            searchable={false}
            value={searchParams.isActive}
            onChange={handleFilterActive}
          />
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            {rooms.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center">
                <Image src="/result-not-found.svg" alt="not found" width={200} height={200} />
                <p>
                  Không tìm thấy phòng nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại
                  với các tiêu chí khác.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Tên phòng</TableHead>
                    <TableHead className="font-semibold">Khách sạn</TableHead>
                    <TableHead className="font-semibold">Chủ sở hữu</TableHead>
                    <TableHead className="font-semibold">Giá một đêm</TableHead>
                    <TableHead className="font-semibold">Số lượng người</TableHead>
                    <TableHead className="font-semibold">Số phòng tối đa</TableHead>
                    <TableHead className="font-semibold">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
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
            )}
          </div>

          <div className="mt-4">
            <Pagination pagination={pagination} />
          </div>
        </CardContent>
      </Card>

      <AddEditRoomDialog
        open={addEditDialogOpen}
        onOpenChange={setAddEditDialogOpen}
        formMode={formMode}
        room={editingRoom}
        onSubmit={handleSubmit}
        isPending={createRoom.isPending || updateRoom.isPending}
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

                  <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-lg">
                    {selectedRoom.images.length !== 0 ? (
                      <Carousel className="size-full">
                        <CarouselContent>
                          {selectedRoom.images.map((image) => (
                            <CarouselItem key={crypto.randomUUID()} className="relative h-64">
                              <Image
                                src={image.url}
                                alt={selectedRoom.name}
                                fill
                                className="object-cover object-center"
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselNext className="right-2" />
                        <CarouselPrevious className="left-2" />
                      </Carousel>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                        Không có ảnh
                      </div>
                    )}
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

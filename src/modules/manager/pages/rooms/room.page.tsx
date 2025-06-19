'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Banknote,
  Building2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Plus,
  Trash2,
  User,
  UsersRound,
} from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/base/components/ui/table';
import { hotelService } from '@/modules/manager/services/hotel.service';
import { CreateRoomSchema, Room, roomService } from '@/modules/manager/services/room.service';

import { AddEditRoomDialog } from './components/add-edit-room-dialog';
import { useRoomMutations } from './hooks/use-room-mutations';

export function RoomManagement() {
  const { data: roomData } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomService.getAllRooms(),
  });
  const { data: hotelData } = useQuery({
    queryKey: ['hotels'],
    queryFn: () => hotelService.getAllHotels(),
  });
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (roomData?.data) {
      setRooms(roomData?.data);
    }
  }, [roomData]);

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

  const handleSubmit = () => {
    if (formMode === 'add') {
      createRoom.mutate(roomFormData);
    } else if (formMode === 'edit' && editingRoom) {
      updateRoom.mutate({ id: editingRoom.id, ...roomFormData });
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
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const paginated = filterRooms.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filterRooms.length / PAGE_SIZE);

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
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Tên phòng</TableHead>
                  <TableHead className="font-semibold">Khách sạn</TableHead>
                  <TableHead className="font-semibold">Chủ sở hữu</TableHead>
                  <TableHead className="font-semibold">Giá</TableHead>
                  <TableHead className="font-semibold">Số lượng người</TableHead>
                  <TableHead className="font-semibold">Số lượng tối đa</TableHead>
                  <TableHead className="text-center font-semibold">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((room, index) => (
                  <TableRow key={room.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{room.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span className="max-w-[200px] truncate">{room.hotel.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-600">
                        <User className="mr-1 h-4 w-4" />
                        {room.hotel.owner.fullName}
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
                              /* handleViewRoom(room) */
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
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {(page - 1) * PAGE_SIZE + 1} -{' '}
              {Math.min(page * PAGE_SIZE, filterRooms.length)} của {filterRooms.length} phòng
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Trước
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                disabled={page >= totalPages}
              >
                Sau
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
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

'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Edit, MoreHorizontal, Trash2, Users } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/base/components/ui/table';

import { User } from '..';
import { useUserMutations } from '../hooks/use-user-mutations';
import { userService } from '../services/user.service';

export function ManagerUsersPage() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'HOTEL_OWNER'>('CUSTOMER');

  const { updateUser, deleteUser } = useUserMutations({
    onUpdateSuccess: () => setRoleDialogOpen(false),
    onDeleteSuccess: () => {
      setDeleteDialogOpen(false);
    },
  });

  const {
    data: {
      data: users,
      metadata: { pagination },
    },
  } = useSuspenseQuery({
    queryKey: ['users', page],
    queryFn: () => userService.getAllUsers({ page }),
  });
  const handleConfirmDelete = () => {
    if (selectedUser?.id) {
      deleteUser.mutate(selectedUser.id);
    }
  };

  return (
    <div className="mx-auto space-y-6 p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <Users className="h-8 w-8 text-blue-600" />
            Quản lý người dùng
          </h1>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push('/manager/users/delete')}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Danh sách xóa
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>
                  <div className="font-semibold">Tên người dùng</div>
                </TableHead>
                <TableHead>
                  <div className="font-semibold">Email</div>
                </TableHead>
                <TableHead>
                  <div className="font-semibold">Giới tính</div>
                </TableHead>
                <TableHead>
                  <div className="font-semibold">Vai trò</div>
                </TableHead>
                <TableHead>
                  <div className="font-semibold">Ngày tạo</div>
                </TableHead>
                <TableHead>
                  <div className="font-semibold">Trạng thái</div>
                </TableHead>
                <TableHead>
                  <div className="font-semibold">Hành động</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="text-gray-600">
                      {user?.fullName || <span className="text-red-600">Chưa có</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-600">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-600">
                      {user?.gender || <span className="text-red-600">Chưa có</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-600">{user.role}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-600">
                      {new Date(user.createTimestamp).toLocaleDateString('vi-VN')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-600">
                      {user.deleteTimestamp ? (
                        <span className="text-red-600">Đã bị xóa</span>
                      ) : (
                        <span className="text-green-600">Đang hoạt động</span>
                      )}
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
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setRoleDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa quyền
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
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
        </CardContent>
      </Card>
      {users && (
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
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật vai trò người dùng</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Chọn vai trò
            </label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as 'CUSTOMER' | 'HOTEL_OWNER')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="CUSTOMER">Khách hàng</option>
              <option value="HOTEL_OWNER">Chủ khách sạn</option>
            </select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleDialogOpen(false)}
              disabled={updateUser.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="default"
              onClick={() => {
                if (!selectedUser) return;
                updateUser.mutate({ id: selectedUser.id, role: selectedRole });
              }}
              disabled={updateUser.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {updateUser.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle
              className={`flex items-center gap-2 ${selectedUser?.deleteTimestamp ? 'text-green-600' : 'text-red-600'}`}
            >
              <>
                <Trash2 className="h-5 w-5" />
                Xác nhận xóa người dùng
              </>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Bạn có chắc chắn muốn <strong>xóa</strong> người dùng{' '}
              <span className="font-semibold text-gray-900">{selectedUser?.fullName}</span> không?
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteUser.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={deleteUser.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteUser.isPending ? 'Đang xóa...' : 'Xóa người dùng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

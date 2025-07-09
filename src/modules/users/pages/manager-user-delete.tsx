'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowLeft, MoreHorizontal, RotateCcw } from 'lucide-react';
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

export function DeletedUsersPage() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

  const { restoreUser } = useUserMutations({
    onRestoreSuccess: () => setRestoreDialogOpen(false),
  });

  const {
    data: {
      data: users,
      metadata: { pagination },
    },
  } = useSuspenseQuery({
    queryKey: ['deleted-users', page],
    queryFn: () => userService.getAllDeletedUsers({ page }),
  });

  const handleConfirmRestore = () => {
    if (selectedUser?.id) {
      restoreUser.mutate(selectedUser.id);
    }
  };

  return (
    <div className="mx-auto space-y-6 p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/manager/users/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>

          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <RotateCcw className="h-8 w-8 text-orange-600" />
            Danh sách người dùng đã bị xóa
          </h1>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Người dùng đã xóa</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Tên người dùng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thời điểm xóa</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user?.fullName || <span className="text-red-600">Chưa có</span>}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.gender || '—'}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {new Date(user.createTimestamp).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell className="text-red-600">
                    {user?.deleteTimestamp ? (
                      new Date(user.deleteTimestamp).toLocaleDateString('vi-VN')
                    ) : (
                      <span className="text-red-600">Không xác định</span>
                    )}
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
                            setRestoreDialogOpen(true);
                          }}
                          className="text-green-600 focus:text-green-600"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Khôi phục
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
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <RotateCcw className="h-5 w-5" />
              Xác nhận khôi phục
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Bạn có chắc chắn muốn <strong>khôi phục</strong> người dùng{' '}
              <span className="font-semibold text-gray-900">{selectedUser?.fullName}</span> không?
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="default"
              onClick={handleConfirmRestore}
              disabled={restoreUser.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {restoreUser.isPending ? 'Đang khôi phục...' : 'Khôi phục'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

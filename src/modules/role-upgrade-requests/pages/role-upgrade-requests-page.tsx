'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Clock, Eye, User, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/base/components/ui/badge';
import { Button } from '@/base/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/base/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/base/components/ui/dialog';
import { Select } from '@/base/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/base/components/ui/table';
import { Textarea } from '@/base/components/ui/textarea';
import {
  RoleUpgradeRequest,
  RoleUpgradeRequestStatus,
  UpdateRoleUpgradeRequestSchema,
  roleUpgradeRequestService,
} from '@/modules/role-upgrade-requests';

export function RoleUpgradeRequestsPage() {
  const [selectedRequest, setSelectedRequest] = useState<RoleUpgradeRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'review'>('approve');
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const queryClient = useQueryClient();

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ['role-upgrade-requests', statusFilter],
    queryFn: () =>
      roleUpgradeRequestService.getAllRequests({
        page: 1,
        pageSize: 50,
        ...(statusFilter !== 'all' && { status: statusFilter as RoleUpgradeRequestStatus }),
      }),
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleUpgradeRequestSchema }) =>
      roleUpgradeRequestService.updateRequestStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-upgrade-requests'] });
      setIsActionModalOpen(false);
      setSelectedRequest(null);
      setAdminNotes('');
      setRejectionReason('');
      toast.success('Cập nhật trạng thái thành công');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    },
  });

  const getStatusBadge = (status: RoleUpgradeRequestStatus) => {
    const variants = {
      [RoleUpgradeRequestStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [RoleUpgradeRequestStatus.UNDER_REVIEW]: 'bg-blue-100 text-blue-800 border-blue-200',
      [RoleUpgradeRequestStatus.APPROVED]: 'bg-green-100 text-green-800 border-green-200',
      [RoleUpgradeRequestStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-200',
    };

    const text = {
      [RoleUpgradeRequestStatus.PENDING]: 'Chờ xử lý',
      [RoleUpgradeRequestStatus.UNDER_REVIEW]: 'Đang xem xét',
      [RoleUpgradeRequestStatus.APPROVED]: 'Đã phê duyệt',
      [RoleUpgradeRequestStatus.REJECTED]: 'Đã từ chối',
    };

    return (
      <Badge className={`${variants[status]} hover:${variants[status]}`}>{text[status]}</Badge>
    );
  };

  const handleAction = (request: RoleUpgradeRequest, action: 'approve' | 'reject' | 'review') => {
    setSelectedRequest(request);
    setActionType(action);
    setIsActionModalOpen(true);
  };

  const handleSubmitAction = () => {
    if (!selectedRequest) return;

    const statusMap = {
      approve: RoleUpgradeRequestStatus.APPROVED,
      reject: RoleUpgradeRequestStatus.REJECTED,
      review: RoleUpgradeRequestStatus.UNDER_REVIEW,
    };

    const updateData: UpdateRoleUpgradeRequestSchema = {
      status: statusMap[actionType],
      adminNotes: adminNotes.trim() || undefined,
      rejectionReason: actionType === 'reject' ? rejectionReason.trim() || undefined : undefined,
    };

    updateRequestMutation.mutate({
      id: selectedRequest.id,
      data: updateData,
    });
  };

  const handleViewDetails = (request: RoleUpgradeRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const requests = requestsData?.data || [];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý yêu cầu nâng cấp tài khoản</h1>
          <p className="text-muted-foreground">
            Xem xét và phê duyệt các yêu cầu nâng cấp từ khách hàng lên chủ khách sạn
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter((r) => r.status === RoleUpgradeRequestStatus.PENDING).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang xem xét</CardTitle>
            <Eye className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter((r) => r.status === RoleUpgradeRequestStatus.UNDER_REVIEW).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã phê duyệt</CardTitle>
            <CheckCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter((r) => r.status === RoleUpgradeRequestStatus.APPROVED).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã từ chối</CardTitle>
            <XCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter((r) => r.status === RoleUpgradeRequestStatus.REJECTED).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <Select
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: RoleUpgradeRequestStatus.PENDING, label: 'Chờ xử lý' },
            { value: RoleUpgradeRequestStatus.UNDER_REVIEW, label: 'Đang xem xét' },
            { value: RoleUpgradeRequestStatus.APPROVED, label: 'Đã phê duyệt' },
            { value: RoleUpgradeRequestStatus.REJECTED, label: 'Đã từ chối' },
          ]}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value || 'all')}
          placeholder="Lọc theo trạng thái"
          triggerClassName="w-48"
        />
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu ({requests.length})</CardTitle>
          <CardDescription>Quản lý các yêu cầu nâng cấp tài khoản</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Thông tin liên hệ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{request.user.fullName || 'N/A'}</div>
                        <div className="text-muted-foreground text-sm">{request.user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{request.contactInfo}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {new Date(request.createTimestamp).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {request.status === RoleUpgradeRequestStatus.PENDING && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(request, 'review')}
                          >
                            Xem xét
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(request, 'approve')}
                            className="text-green-600 hover:text-green-700"
                          >
                            Phê duyệt
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(request, 'reject')}
                            className="text-red-600 hover:text-red-700"
                          >
                            Từ chối
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {requests.length === 0 && (
            <div className="text-muted-foreground py-8 text-center">Không có yêu cầu nào</div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu nâng cấp tài khoản</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Người dùng</label>
                  <p className="text-muted-foreground text-sm">
                    {selectedRequest.user.fullName || 'N/A'} ({selectedRequest.user.email})
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Thông tin liên hệ</label>
                <p className="text-muted-foreground text-sm">{selectedRequest.contactInfo}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Lý do yêu cầu</label>
                <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                  {selectedRequest.reason}
                </p>
              </div>
              {selectedRequest.adminNotes && (
                <div>
                  <label className="text-sm font-medium">Ghi chú admin</label>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                    {selectedRequest.adminNotes}
                  </p>
                </div>
              )}
              {selectedRequest.rejectionReason && (
                <div>
                  <label className="text-sm font-medium">Lý do từ chối</label>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                    {selectedRequest.rejectionReason}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Ngày tạo</label>
                  <p className="text-muted-foreground text-sm">
                    {new Date(selectedRequest.createTimestamp).toLocaleString('vi-VN')}
                  </p>
                </div>
                {selectedRequest.reviewedAt && (
                  <div>
                    <label className="text-sm font-medium">Ngày xử lý</label>
                    <p className="text-muted-foreground text-sm">
                      {new Date(selectedRequest.reviewedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Modal */}
      <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && 'Phê duyệt yêu cầu'}
              {actionType === 'reject' && 'Từ chối yêu cầu'}
              {actionType === 'review' && 'Đánh dấu đang xem xét'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' &&
                'Phê duyệt yêu cầu này sẽ nâng cấp tài khoản người dùng lên Chủ khách sạn.'}
              {actionType === 'reject' && 'Từ chối yêu cầu này. Vui lòng cung cấp lý do từ chối.'}
              {actionType === 'review' &&
                'Đánh dấu yêu cầu này đang được xem xét để liên hệ với người dùng.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Ghi chú (tuỳ chọn)</label>
              <Textarea
                placeholder="Thêm ghi chú về quyết định này..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
            {actionType === 'reject' && (
              <div>
                <label className="text-sm font-medium">Lý do từ chối *</label>
                <Textarea
                  placeholder="Vui lòng cung cấp lý do từ chối yêu cầu..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionModalOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmitAction}
              disabled={
                updateRequestMutation.isPending ||
                (actionType === 'reject' && !rejectionReason.trim())
              }
            >
              {updateRequestMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

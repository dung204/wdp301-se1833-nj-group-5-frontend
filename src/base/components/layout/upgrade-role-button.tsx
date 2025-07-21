'use client';

import { Crown, Loader2, Settings } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/base/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/base/components/ui/dialog';
import { Input } from '@/base/components/ui/input';
import { Label } from '@/base/components/ui/label';
import { Textarea } from '@/base/components/ui/textarea';
import { Role } from '@/modules/auth';
import {
  CreateRoleUpgradeRequestSchema,
  RequestType,
  RoleUpgradeRequest,
  RoleUpgradeRequestStatus,
  roleUpgradeRequestService,
} from '@/modules/role-upgrade-requests';

interface RoleManagementButtonProps {
  userRole: Role;
  onUpgradeSuccess?: () => void;
}

export function RoleManagementButton({ userRole, onUpgradeSuccess }: RoleManagementButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingRequest, setExistingRequest] = useState<RoleUpgradeRequest | null>(null);

  // Check for existing request when component mounts
  useEffect(() => {
    if (userRole === Role.CUSTOMER) {
      checkExistingRequest();
    }
  }, [userRole]);

  const checkExistingRequest = async () => {
    try {
      const response = await roleUpgradeRequestService.getCurrentUserRequest();
      setExistingRequest(response.data);
    } catch (error) {
      console.error('Error checking existing request:', error);
    }
  };

  // Show manage hotel button for HOTEL_OWNER
  if (userRole === Role.HOTEL_OWNER) {
    return (
      <Button asChild variant="outline" size="sm" className="gap-2">
        <Link href="/manager/dashboard">
          <Settings className="h-4 w-4" />
          Quản lý khách sạn
        </Link>
      </Button>
    );
  }

  // Only show upgrade button for CUSTOMER role
  if (userRole !== Role.CUSTOMER) {
    return null;
  }

  // Show status for existing request
  if (existingRequest) {
    const getStatusText = (status: RoleUpgradeRequestStatus) => {
      switch (status) {
        case RoleUpgradeRequestStatus.PENDING:
          return 'Yêu cầu đang chờ xử lý';
        case RoleUpgradeRequestStatus.UNDER_REVIEW:
          return 'Yêu cầu đang được xem xét';
        case RoleUpgradeRequestStatus.APPROVED:
          return 'Yêu cầu đã được phê duyệt';
        case RoleUpgradeRequestStatus.REJECTED:
          return 'Yêu cầu đã bị từ chối';
        default:
          return 'Yêu cầu đang xử lý';
      }
    };

    const getStatusColor = (status: RoleUpgradeRequestStatus) => {
      switch (status) {
        case RoleUpgradeRequestStatus.PENDING:
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case RoleUpgradeRequestStatus.UNDER_REVIEW:
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case RoleUpgradeRequestStatus.APPROVED:
          return 'bg-green-100 text-green-800 border-green-200';
        case RoleUpgradeRequestStatus.REJECTED:
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <div
        className={`rounded-md border px-3 py-2 text-xs font-medium ${getStatusColor(existingRequest.status)}`}
      >
        {getStatusText(existingRequest.status)}
      </div>
    );
  }

  const handleSubmitRequest = async () => {
    if (!contactInfo.trim() || !reason.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    try {
      const requestData: CreateRoleUpgradeRequestSchema = {
        requestType: RequestType.CUSTOMER_TO_HOTEL_OWNER,
        targetRole: Role.HOTEL_OWNER,
        contactInfo: contactInfo.trim(),
        reason: reason.trim(),
      };

      const response = await roleUpgradeRequestService.createRequest(requestData);

      if (response.data) {
        toast.success('Yêu cầu nâng cấp đã được gửi!', {
          description: 'Admin sẽ xem xét và liên hệ với bạn trong thời gian sớm nhất.',
        });

        // Close dialog and reset form
        setIsOpen(false);
        setContactInfo('');
        setReason('');

        // Refresh to show the status badge
        setExistingRequest(response.data);
        onUpgradeSuccess?.();
      }
    } catch (error) {
      toast.error('Gửi yêu cầu thất bại', {
        description: 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.',
      });
      console.error('Submit request error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Crown className="h-4 w-4" />
          Bạn cần quản lý khách sạn?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Yêu cầu nâng cấp tài khoản
          </DialogTitle>
          <DialogDescription>
            Gửi yêu cầu nâng cấp tài khoản từ Khách hàng lên Chủ khách sạn. Admin sẽ xem xét và liên
            hệ với bạn để xác minh thông tin trước khi phê duyệt yêu cầu.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactInfo">
              Thông tin liên hệ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contactInfo"
              placeholder="Số điện thoại hoặc email để admin liên hệ"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              Ví dụ: +84 123 456 789 hoặc contact@example.com
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              Lý do yêu cầu nâng cấp <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Mô tả lý do tại sao bạn muốn trở thành chủ khách sạn..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
            <p className="text-muted-foreground text-xs">
              Tối thiểu 20 ký tự. Ví dụ: &quot;Tôi sở hữu khách sạn ABC và muốn quản lý nó thông qua
              hệ thống của bạn&quot;
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleSubmitRequest} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Crown className="h-4 w-4" />
                Gửi yêu cầu
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Backward compatibility export
export { RoleManagementButton as UpgradeRoleButton };

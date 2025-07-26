'use client';

import { Crown, Loader2, Settings } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
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
import { userService } from '@/modules/users';

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
  const [currentUserRole, setCurrentUserRole] = useState<Role>(userRole);

  const checkExistingRequest = useCallback(async () => {
    try {
      const response = await roleUpgradeRequestService.getCurrentUserRequest();
      setExistingRequest(response.data);
    } catch (error) {
      console.error('Error checking existing request:', error);
      // Don't break the UI - just set to null so the button works normally
      setExistingRequest(null);
    }
  }, []);

  // Function to refresh user data and update cookies
  const refreshUserData = useCallback(async () => {
    try {
      const userProfile = await userService.getUserProfile();
      const updatedUser = userProfile.data;

      // Update the user cookie with the new role
      await fetch('/api/auth/set-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updatedUser.id,
          role: updatedUser.role,
          fullName: updatedUser.fullName,
          gender: updatedUser.gender,
        }),
      });

      // Update local state
      setCurrentUserRole(updatedUser.role);

      return updatedUser.role;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      return null;
    }
  }, []);

  // Check for existing request when component mounts
  useEffect(() => {
    if (currentUserRole === Role.CUSTOMER) {
      checkExistingRequest();
    }
  }, [currentUserRole, checkExistingRequest]);

  // Check for role updates on mount if user role hasn't updated yet
  useEffect(() => {
    const checkInitialRoleUpdate = async () => {
      if (currentUserRole === Role.CUSTOMER) {
        const newRole = await refreshUserData();
        // If user was already upgraded but cookies are stale, update immediately
        if (newRole === Role.HOTEL_OWNER) {
          toast.success('Chào mừng! Tài khoản của bạn đã được nâng cấp thành công!', {
            description: 'Bạn hiện đã là chủ khách sạn và có thể quản lý khách sạn.',
          });
        }
      }
    };

    checkInitialRoleUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Periodically check for role updates when user has an approved request
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (
      existingRequest &&
      existingRequest.status === RoleUpgradeRequestStatus.APPROVED &&
      currentUserRole === Role.CUSTOMER
    ) {
      // Check every 5 seconds for role updates
      intervalId = setInterval(async () => {
        const newRole = await refreshUserData();
        if (newRole === Role.HOTEL_OWNER) {
          // Role has been updated, show success message and reload page
          toast.success('Tài khoản đã được nâng cấp thành công!', {
            description: 'Bạn hiện đã là chủ khách sạn và có thể quản lý khách sạn.',
          });

          // Reload the page to refresh all components with the new role
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingRequest, currentUserRole]); // refreshUserData is stable, excluded to prevent restarts

  // Show manage hotel button for HOTEL_OWNER
  if (currentUserRole === Role.HOTEL_OWNER) {
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
  if (currentUserRole !== Role.CUSTOMER) {
    return null;
  }

  // Show status for existing request
  if (existingRequest) {
    // If request is approved, show management button (user should be upgraded)
    if (existingRequest.status === RoleUpgradeRequestStatus.APPROVED) {
      return (
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/manager/dashboard">
            <Settings className="h-4 w-4" />
            Quản lý khách sạn
          </Link>
        </Button>
      );
    }

    const getStatusText = (status: RoleUpgradeRequestStatus) => {
      switch (status) {
        case RoleUpgradeRequestStatus.PENDING:
          return 'Yêu cầu đang chờ xử lý';
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
        await checkExistingRequest();
        onUpgradeSuccess?.();
      }
    } catch (error) {
      console.error('Submit request error:', error);

      // Handle specific error cases
      let errorMessage = 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const standardError = error as { message: string };
        errorMessage = standardError.message;
      }

      toast.error('Gửi yêu cầu thất bại', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Crown className="h-4 w-4" />
          Nâng cấp tài khoản
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

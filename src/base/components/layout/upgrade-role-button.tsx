'use client';

import { Crown, Loader2, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
import { Textarea } from '@/base/components/ui/textarea';
import { Role } from '@/modules/auth';
import { userService } from '@/modules/users';

interface RoleManagementButtonProps {
  userRole: Role;
  onUpgradeSuccess?: () => void;
}

export function RoleManagementButton({ userRole, onUpgradeSuccess }: RoleManagementButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await userService.upgradeRole({
        targetRole: Role.HOTEL_OWNER,
        reason: reason.trim() || undefined,
      });

      if (response.data) {
        toast.success('Nâng cấp tài khoản thành công!', {
          description: 'Tài khoản của bạn đã được nâng cấp thành Chủ khách sạn.',
        });

        // Close dialog first
        setIsOpen(false);
        setReason('');

        // Update the user cookie with the new role
        const updatedUser = response.data;
        await fetch('/api/auth/set-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: updatedUser.id,
            fullName: updatedUser.fullName,
            role: updatedUser.role,
            gender: updatedUser.gender,
          }),
        });

        // Reload the page to update the user context and show the new button
        router.refresh();

        // Call callback if provided
        onUpgradeSuccess?.();
      }
    } catch (error) {
      toast.error('Nâng cấp tài khoản thất bại', {
        description: 'Có lỗi xảy ra khi nâng cấp tài khoản. Vui lòng thử lại.',
      });
      console.error('Upgrade role error:', error);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Nâng cấp tài khoản
          </DialogTitle>
          <DialogDescription>
            Nâng cấp tài khoản của bạn từ Khách hàng lên Chủ khách sạn để có thể thêm khách sạn vào
            hệ thống để quản lý. Tất cả dữ liệu hiện tại (lịch sử đặt phòng, khách sạn yêu thích...)
            sẽ được bảo toàn. Hành dộng này sẽ không thể hoàn tác, vì vậy hãy chắc chắn rằng bạn
            muốn nâng cấp tài khoản của mình.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="reason"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Lý do nâng cấp (tùy chọn)
            </label>
            <Textarea
              id="reason"
              placeholder="Ví dụ: Tôi muốn quản lý khách sạn của tôi..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleUpgrade} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang nâng cấp...
              </>
            ) : (
              <>
                <Crown className="h-4 w-4" />
                Nâng cấp ngay
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

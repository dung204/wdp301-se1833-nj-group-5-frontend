'use client';

import axios from 'axios';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/base/components/ui/alert-dialog';
import { buttonVariantsFn } from '@/base/components/ui/button';

export function ConfirmLogoutDialog(props: ComponentProps<typeof AlertDialog>) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await axios.delete('/api/auth/delete-cookie');
    if (
      pathname.startsWith('/manager') ||
      pathname.startsWith('/profile') ||
      pathname.startsWith('/favorites')
    ) {
      window.location.href = '/';
    } else {
      window.location.reload();
    }
  };

  return (
    <AlertDialog {...props}>
      <AlertDialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn đăng xuất hay không?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className={buttonVariantsFn({ variant: 'danger' })}
          >
            Tiếp tục
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';

import { SidebarMenuButton } from '@/base/components/ui/sidebar';

export function ManagerSidebarHomeLink() {
  return (
    <SidebarMenuButton asChild tooltip="Trở về trang chủ">
      <Link href="/" className="flex w-full items-center gap-2">
        <Home className="h-4 w-4" />
        <span>Trở về trang chủ</span>
      </Link>
    </SidebarMenuButton>
  );
}

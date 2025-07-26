import Image from 'next/image';
import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/base/components/ui/sidebar';
import { userSchema } from '@/modules/users';

import { ManagerSidebarHomeLink } from './manager-sidebar-home-link';
import { ManagerSidebarNav } from './manager-sidebar-nav';
import { ManagerSidebarUserMenu } from './manager-sidebar-user-menu';

export async function ManagerSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const user = userSchema
    .pick({
      id: true,
      fullName: true,
      role: true,
      gender: true,
    })
    .safeParse(JSON.parse(cookieStore.get('user')?.value ?? '{}')).data;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="items-center justify-center py-6">
        <Image src="/travel-booking-logo.png" alt="Sidebar Logo" width={200} height={200} />
      </SidebarHeader>

      <SidebarContent>
        <ManagerSidebarNav userRole={user?.role} />
      </SidebarContent>

      <SidebarFooter>
        <ManagerSidebarHomeLink />
        <ManagerSidebarUserMenu user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

import { useSuspenseQuery } from '@tanstack/react-query';
import { BedDouble, CalendarCheck2, Hotel, LayoutDashboard, Percent, Users } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/base/components/ui/sidebar';
import { userService } from '@/modules/users';

import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: res } = useSuspenseQuery({
    queryKey: ['users', 'profile'],
    queryFn: () => userService.getUserProfile(),
  });

  const user = res.data;
  const data = {
    navMain: [
      {
        name: 'Dashboard',
        url: '/manager/dashboard',
        icon: LayoutDashboard,
        title: 'Dashboard',
        role: ['ADMIN', 'HOTEL_OWNER'],
      },
      {
        name: 'Users',
        url: '/manager/users',
        icon: Users,
        title: 'Manage Customer',
        role: ['ADMIN', 'HOTEL_OWNER'],
      },
      {
        name: 'Bookings',
        url: '/manager/bookings',
        icon: CalendarCheck2,
        title: 'Manage Bookings',
        role: ['ADMIN', 'HOTELOWNER', 'HOTEL_OWNER'],
      },
      {
        name: 'Hotels',
        url: '/manager/hotels',
        icon: Hotel,
        title: 'Manage Hotels',
        role: ['ADMIN', 'HOTEL_OWNER'],
      },
      {
        name: 'Rooms',
        url: '/manager/rooms',
        icon: BedDouble,
        title: 'Manage Rooms',
        role: ['ADMIN', 'HOTEL_OWNER'],
      },
      {
        name: 'Discounts',
        url: '/manager/discounts',
        icon: Percent,
        title: 'Manage Discounts',
        role: ['ADMIN', 'HOTEL_OWNER'],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Image src="/code_mely_avatar.jpg" alt="Sidebar Logo" width={200} height={200} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} userRole={user.role} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

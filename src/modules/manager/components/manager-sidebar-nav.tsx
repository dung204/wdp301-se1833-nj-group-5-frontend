'use client';

import {
  BedDouble,
  CalendarCheck2,
  ChevronRight,
  Hotel,
  LayoutDashboard,
  type LucideIcon,
  Percent,
  UserCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/base/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/base/components/ui/sidebar';
import { Role } from '@/modules/auth';

type NavItem = {
  name: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
  role: Role[];
};

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    url: '/manager/dashboard',
    icon: LayoutDashboard,
    title: 'Bảng điều khiển',
    role: [Role.ADMIN, Role.HOTEL_OWNER],
  },
  {
    name: 'Users',
    url: '/manager/users',
    icon: Users,
    title: 'Quản lý Khách hàng',
    role: [Role.ADMIN],
  },
  {
    name: 'RoleUpgradeRequests',
    url: '/manager/role-upgrade-requests',
    icon: UserCheck,
    title: 'Yêu cầu nâng cấp tài khoản',
    role: [Role.ADMIN],
  },
  {
    name: 'Bookings',
    url: '/manager/bookings',
    icon: CalendarCheck2,
    title: 'Quản lý Đặt phòng',
    role: [Role.ADMIN, Role.HOTEL_OWNER],
  },
  {
    name: 'Hotels',
    url: '/manager/hotels',
    icon: Hotel,
    title: 'Quản lý Khách sạn',
    role: [Role.ADMIN, Role.HOTEL_OWNER],
  },
  {
    name: 'Rooms',
    url: '/manager/rooms',
    icon: BedDouble,
    title: 'Quản lý Phòng',
    role: [Role.ADMIN, Role.HOTEL_OWNER],
  },
  {
    name: 'Discounts',
    url: '/manager/discounts',
    icon: Percent,
    title: 'Quản lý Khuyến mãi',
    role: [Role.ADMIN],
  },
];

type NavMainProps = {
  userRole?: Role;
};

export function ManagerSidebarNav({ userRole }: NavMainProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems
          .filter((item) => userRole && item.role.includes(userRole))
          .map((item) => {
            const isActive = Boolean(pathname && item.url && pathname.includes(item.url));
            if (item.items && item.items.length > 0) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          const isSubActive = Boolean(
                            pathname && subItem.url && pathname.includes(subItem.url),
                          );
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={isSubActive}>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                  <Link href={item.url} className="flex w-full items-center">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

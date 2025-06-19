'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronDown, Heart, LogOut, ShoppingCart, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/base/components/ui/badge';
import { Button } from '@/base/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/base/components/ui/dropdown-menu';
import { userService } from '@/modules/users';

export default function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: res } = useQuery({
    queryKey: ['users', 'profile'],
    queryFn: async () => {
      try {
        return await userService.getUserProfile();
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          return null;
        }
        throw err;
      }
    },
    retry: false,
  });
  const userData = res?.data;

  const handleLogout = async () => {
    await axios.delete('/api/auth/delete-cookie');
    queryClient.removeQueries({ queryKey: ['users', 'profile'] });
    router.push('/');
    router.refresh();
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b bg-white">
      <div className="container mx-auto flex h-30 items-center justify-between px-4">
        <Link href="/" className="">
          <Image src="/logo_hotel.jpg" width={100} height={100} alt="Logo" />
        </Link>
        <div className="flex items-center gap-24">
          <nav className="hidden items-center space-x-1 md:flex">
            <Button variant="ghost" size="sm" className="relative h-8 text-xs">
              Máy bay + Khách sạn
              <Badge variant="danger" className="absolute -top-1 -right-1 h-4 text-[10px]">
                Hot
              </Badge>
            </Button>
            <Link href="/list-hotel">
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                Chỗ ở
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="relative h-8 text-xs">
              Phương tiện di chuyển <ChevronDown className="ml-1 h-3 w-3" />
              <Badge variant="danger" className="absolute -top-2 left-2 h-4 text-[10px]">
                Mới
              </Badge>
            </Button>
            <Button variant="ghost" size="sm" className="relative h-8 text-xs">
              Hoạt động
              <Badge variant="danger" className="absolute -top-1 -right-1 h-4 text-[10px]">
                Hot
              </Badge>
            </Button>
            <Link href="/discount">
              <Button variant="ghost" size="sm" className="relative h-8 text-xs">
                Phiếu giảm giá và ưu đãi
                <Badge variant="danger" className="absolute -top-1 -right-1 h-4 text-[10px]">
                  Hot
                </Badge>
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Language */}
          <Button variant="ghost" size="sm" className="hidden font-bold md:flex">
            <Image src="/flag-vn.jpg" width={30} height={10} alt="Vietnam flag" />
            VN
          </Button>
          <Link href="/favorites">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Heart className="mr-2 h-4 w-4" />
              Yêu thích
            </Button>
          </Link>

          {/* User Dropdown */}
          {userData ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <User />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <>
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Thông tin cá nhân</Link>
                    </DropdownMenuItem>
                    {(userData?.role === 'ADMIN' || userData?.role === 'HOTELOWNER') && (
                      <DropdownMenuItem asChild>
                        <Link href="/manager/dashboard">Bảng điều khiển</Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push(`/auth/login`)}>
                Đăng nhập
              </Button>
              <Button variant="outline" size="sm">
                Tạo tài khoản
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" className="text-gray-500">
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </header>
  );
}

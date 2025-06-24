'use client';

import { Calendar, SearchIcon, Users } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { Button } from '@/base/components/ui/button';
import { Calendar as UiCalendar } from '@/base/components/ui/calendar';
import { Card, CardContent } from '@/base/components/ui/card';
import { Input } from '@/base/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/base/components/ui/popover';
import { cn } from '@/base/lib';
import { DateTimeUtils } from '@/base/utils';

export function HotelSearchBox() {
  const [showSearchDropdown, setShowSearchDropdown] = React.useState(false);
  const [room, setRoom] = React.useState(1);
  const [roomError, setRoomError] = React.useState('');
  const [adult, setAdult] = React.useState(2);
  const [children, setChildren] = React.useState(0);
  const [dateRange, setDateRange] = React.useState<{ from?: Date; to?: Date }>({
    from: new Date(2025, 4, 31), // 31 May 2025
    to: new Date(2025, 5, 20), // 20 Jun 2025
  });

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('input') && !target.closest('.search-dropdown')) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col">
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <Image src="/home-banner.png" alt="home banner" fill priority />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-6">
          <div className="mx-auto mb-6 max-w-4xl text-center">
            <h1 className="mb-2 text-2xl font-bold text-white">
              RONG CHƠI BỐN PHƯƠNG, GIÁ VẪN YÊU THƯƠNG
            </h1>
            <div className="inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-sm text-white">
              Tiết kiệm hơn 15%
            </div>
          </div>

          <div className="mx-auto w-5xl">
            <Card>
              <CardContent className="flex flex-col gap-4">
                <div className="flex space-x-6 px-6">
                  <Button variant="outline" className="rounded-full text-sm">
                    Chỉ Ở Qua Đêm
                  </Button>
                  <Button variant="outline" className="rounded-full text-sm">
                    Chỉ Ở Trong Ngày
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 px-6 md:grid-cols-3">
                  <div className="col-span-1 md:col-span-3">
                    <div className="search-dropdown-container relative">
                      <div
                        className={cn(
                          'border-input flex items-center rounded-md border px-4 pr-2 transition-all',
                          'has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-ring/50 has-[input:focus-visible]:ring-[3px]',
                          'has-[input[aria-invalid="true"]]:ring-danger/20 dark:has-[input[aria-invalid="true"]]:ring-danger/40 has-[input[aria-invalid="true"]]:border-danger',
                          'py-2',
                        )}
                      >
                        <SearchIcon className="text-muted-foreground" />
                        <Input
                          autoFocus
                          className="rounded-none border-0 text-base! shadow-none ring-0 focus-visible:ring-0"
                          onClick={() => setShowSearchDropdown(true)}
                        />
                      </div>
                      {showSearchDropdown && (
                        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-[80vh] w-full overflow-hidden overflow-y-auto rounded-lg border bg-white shadow-lg">
                          <div className="p-4">
                            <h3 className="mb-2 text-sm font-medium text-gray-500">
                              Tìm kiếm gần đây
                            </h3>
                            <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-3">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className="cursor-pointer rounded border p-2 hover:bg-gray-50"
                                >
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="text-sm font-medium">Phan Thiết, Việt Nam</p>
                                      <p className="text-xs text-gray-500">
                                        {i === 1
                                          ? '21 tháng 5 2025 - 25 tháng 5 2025'
                                          : i === 2
                                            ? '16 tháng 5 2025 - 21 tháng 5 2025'
                                            : '18 tháng 5 2025 - 19 tháng 5 2025'}
                                      </p>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600"></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div>
                                <h3 className="mb-2 text-sm font-medium text-gray-500">
                                  Các điểm đến ở Việt Nam
                                </h3>
                                <div className="space-y-3">
                                  {[
                                    {
                                      name: 'Hồ Chí Minh',
                                      count: '15,546',
                                      desc: 'nhà hàng, mua sắm',
                                    },
                                    {
                                      name: 'Hà Nội',
                                      count: '10,744',
                                      desc: 'nhà hàng, tham quan',
                                    },
                                  ].map((city, index) => (
                                    <div
                                      key={index}
                                      className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50"
                                    >
                                      <Image
                                        src={`/placeholder.svg?height=40&width=40`}
                                        width={40}
                                        height={40}
                                        alt={city.name}
                                        className="rounded object-cover"
                                      />
                                      <div>
                                        <p className="text-sm font-medium">
                                          {city.name}{' '}
                                          <span className="font-normal text-gray-400">
                                            ({city.count})
                                          </span>
                                        </p>
                                        <p className="text-xs text-gray-500">{city.desc}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h3 className="mb-2 text-sm font-medium text-gray-500">
                                  Các điểm đến quốc tế
                                </h3>
                                <div className="space-y-3">
                                  {[
                                    { name: 'Seoul', count: '5,945', desc: 'mua sắm, nhà hàng' },
                                    {
                                      name: 'Bangkok',
                                      count: '12,048',
                                      desc: 'mua sắm, nhà hàng',
                                    },
                                    {
                                      name: 'Tokyo',
                                      count: '12,496',
                                      desc: 'mua sắm, tham quan',
                                    },
                                  ].map((city, index) => (
                                    <div
                                      key={index}
                                      className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50"
                                    >
                                      <Image
                                        src={`/placeholder.svg?height=40&width=40`}
                                        width={40}
                                        height={40}
                                        alt={city.name}
                                        className="rounded object-cover"
                                      />
                                      <div>
                                        <p className="text-sm font-medium">
                                          {city.name}{' '}
                                          <span className="font-normal text-gray-400">
                                            ({city.count})
                                          </span>
                                        </p>
                                        <p className="text-xs text-gray-500">{city.desc}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="relative w-full">
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="col-span-2 flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm transition hover:shadow-md">
                            {/* Ngày bắt đầu */}
                            <div className="flex w-1/2 items-center space-x-2 border-r pr-4">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  {dateRange.from
                                    ? DateTimeUtils.formatDay(dateRange.from)
                                    : 'Chọn ngày'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {dateRange.from
                                    ? DateTimeUtils.formatWeekday(dateRange.from)
                                    : ''}
                                </div>
                              </div>
                            </div>
                            {/* Ngày kết thúc */}
                            <div className="flex w-1/2 items-center space-x-2 pl-4">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  {dateRange.to
                                    ? DateTimeUtils.formatDay(dateRange.to)
                                    : 'Chọn ngày'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {dateRange.to ? DateTimeUtils.formatWeekday(dateRange.to) : ''}
                                </div>
                              </div>
                            </div>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="mt-1 w-auto rounded-lg border bg-white p-0 shadow-lg">
                          <UiCalendar
                            locale={DateTimeUtils.dateTimeLocale}
                            mode="range"
                            selected={{ from: dateRange.from, to: dateRange.to }}
                            onSelect={(range) =>
                              setDateRange({
                                from: range?.from ?? undefined,
                                to: range?.to ?? undefined,
                              })
                            }
                            numberOfMonths={2}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div
                          className={cn(
                            'border-input flex items-center rounded-md border px-4 pr-2 transition-all',
                            'has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-ring/50 has-[input:focus-visible]:ring-[3px]',
                            'has-[input[aria-invalid="true"]]:ring-danger/20 dark:has-[input[aria-invalid="true"]]:ring-danger/40 has-[input[aria-invalid="true"]]:border-danger',
                            'py-2',
                          )}
                        >
                          <Users className="text-muted-foreground" />
                          <Input
                            readOnly
                            value={`${adult} người lớn${children > 0 ? `, ${children} trẻ em` : ''}, ${room} phòng`}
                            className="rounded-none border-0 text-base! shadow-none ring-0 focus-visible:ring-0"
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)]">
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <div className="font-medium">Phòng</div>
                            {roomError && <p className="mt-1 text-sm text-red-500">{roomError}</p>}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setRoom((prev: number) => Math.max(1, prev - 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-full border"
                            >
                              -
                            </button>
                            <span>{room}</span>
                            <button
                              onClick={() => {
                                const totalGuests = adult + children;
                                if (room < totalGuests) {
                                  setRoom((prev) => prev + 1);
                                  setRoomError('');
                                } else {
                                  setRoomError('Số phòng không được vượt quá tổng số người.');
                                }
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-full border"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <div className="font-medium">Người lớn</div>
                            <div className="text-sm text-gray-500">18 tuổi trở lên</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setAdult((prev: number) => Math.max(1, prev - 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-full border"
                            >
                              -
                            </button>
                            <span>{adult}</span>
                            <button
                              onClick={() => setAdult((prev) => prev + 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-full border"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Trẻ em</div>
                            <div className="text-sm text-gray-500">0-17 tuổi</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-full border"
                            >
                              -
                            </button>
                            <span>{children}</span>
                            <button
                              onClick={() => setChildren((prev) => prev + 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-full border"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="col-span-3 flex w-full items-center">
                    <Button className="mx-auto h-12 bg-blue-500 text-white hover:bg-blue-600 md:w-1/4">
                      TÌM
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

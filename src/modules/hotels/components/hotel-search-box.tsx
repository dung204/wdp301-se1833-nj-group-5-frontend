'use client';

import { addDays, differenceInDays, format } from 'date-fns';
import { CalendarIcon, MinusIcon, PlusIcon, SearchIcon, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/base/components/ui/alert-dialog';
import { Button } from '@/base/components/ui/button';
import { Calendar } from '@/base/components/ui/calendar';
import { Card, CardContent } from '@/base/components/ui/card';
import { Input } from '@/base/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/base/components/ui/popover';
import { cn } from '@/base/lib';
import { DateTimeUtils } from '@/base/utils';

import { hotelSearchParamsSchema } from '../types';

export function HotelSearchBox() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchQueryEmptyDialogOpen, setSearchQueryEmptyDialogOpen] = React.useState(false);
  const [checkInCheckOutDateInvalidDialogOpen, setCheckInCheckOutDateInvalidDialogOpen] =
    React.useState(false);
  const [rooms, setRooms] = React.useState(1);
  const [numberOfPeople, setNumberOfPeople] = React.useState(2);
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: new Date(), // 31 May 2025
    to: addDays(new Date(), 1), // 20 Jun 2025
  });

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setSearchQueryEmptyDialogOpen(true);
      return;
    }

    if (
      !dateRange ||
      !dateRange.from ||
      !dateRange.to ||
      differenceInDays(dateRange.to, dateRange.from) < 1
    ) {
      setCheckInCheckOutDateInvalidDialogOpen(true);
      return;
    }

    const searchParams = new URLSearchParams();

    searchParams.set('searchTerm', searchQuery);
    searchParams.set('checkIn', format(dateRange.from, 'yyyy-MM-dd'));
    searchParams.set('checkOut', format(dateRange.to, 'yyyy-MM-dd'));
    searchParams.set('rooms', rooms.toString());
    searchParams.set('occupancy', numberOfPeople.toString());

    router.push(`/hotels?${searchParams.toString()}`);
  };

  return (
    <>
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
                  <div className="grid grid-cols-1 gap-4 px-6 md:grid-cols-3">
                    <div className="col-span-1 md:col-span-3">
                      <SearchInput
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="col-span-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <CheckInCheckOutDatePicker
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                      />
                      <OccupancyInput
                        numberOfPeople={numberOfPeople}
                        rooms={rooms}
                        onNumberOfPeople={setNumberOfPeople}
                        onRoomsChange={setRooms}
                      />
                    </div>
                    <div className="col-span-3 flex w-full items-center">
                      <Button
                        className="mx-auto h-12 bg-blue-500 text-white uppercase hover:bg-blue-600 md:w-1/4"
                        onClick={() => handleSearch()}
                      >
                        Tìm
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
      <SearchQueryEmptyDialog
        open={searchQueryEmptyDialogOpen}
        onOpenChange={setSearchQueryEmptyDialogOpen}
      />
      <CheckInCheckOutDateInvalidDialog
        open={checkInCheckOutDateInvalidDialogOpen}
        onOpenChange={setCheckInCheckOutDateInvalidDialogOpen}
      />
    </>
  );
}

export function HotelSearchBoxSmall() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    searchTerm,
    checkIn,
    checkOut,
    rooms: numberOfRooms,
    minOccupancy,
  } = hotelSearchParamsSchema.parse(Object.fromEntries(Array.from(searchParams.entries())));

  const [searchQuery, setSearchQuery] = React.useState(searchTerm);
  const [searchQueryEmptyDialogOpen, setSearchQueryEmptyDialogOpen] = React.useState(false);
  const [checkInCheckOutDateInvalidDialogOpen, setCheckInCheckOutDateInvalidDialogOpen] =
    React.useState(false);
  const [rooms, setRooms] = React.useState(numberOfRooms);
  const [numberOfPeople, setNumberOfPeople] = React.useState(minOccupancy);
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: checkIn,
    to: checkOut,
  });

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setSearchQueryEmptyDialogOpen(true);
      return;
    }

    if (
      !dateRange ||
      !dateRange.from ||
      !dateRange.to ||
      differenceInDays(dateRange.to, dateRange.from) < 1
    ) {
      setCheckInCheckOutDateInvalidDialogOpen(true);
      return;
    }

    const url = new URL(window.location.href);

    url.searchParams.set('searchTerm', searchQuery);
    url.searchParams.set('checkIn', format(dateRange.from, 'yyyy-MM-dd'));
    url.searchParams.set('checkOut', format(dateRange.to, 'yyyy-MM-dd'));
    url.searchParams.set('rooms', rooms.toString());
    url.searchParams.set('', numberOfPeople.toString());

    router.push(url.href);
  };

  return (
    <>
      <section className="bg-blue-900">
        <div className="mx-auto grid max-w-7xl grid-cols-24 items-center gap-2 px-4 py-2">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="col-span-7"
          />
          <CheckInCheckOutDatePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
            className="col-span-7"
          />
          <OccupancyInput
            numberOfPeople={numberOfPeople}
            rooms={rooms}
            onNumberOfPeople={setNumberOfPeople}
            onRoomsChange={setRooms}
            className="col-span-7"
          />
          <Button
            className="col-span-3 mx-auto size-full! h-12 bg-blue-500 text-white uppercase hover:bg-blue-600"
            onClick={() => handleSearch()}
          >
            Tìm
          </Button>
        </div>
      </section>
      <SearchQueryEmptyDialog
        open={searchQueryEmptyDialogOpen}
        onOpenChange={setSearchQueryEmptyDialogOpen}
      />
      <CheckInCheckOutDateInvalidDialog
        open={checkInCheckOutDateInvalidDialogOpen}
        onOpenChange={setCheckInCheckOutDateInvalidDialogOpen}
      />
    </>
  );
}

function SearchInput({ value, onChange, className }: React.ComponentProps<typeof Input>) {
  const [showSearchDropdown, setShowSearchDropdown] = React.useState(false);

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
    <div className={cn('search-dropdown-container relative size-full', className)}>
      <div
        className={cn(
          'border-input flex size-full items-center rounded-md border bg-white px-4 pr-2 transition-all',
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
          placeholder="Nhập điểm du lịch hoặc tên khách sạn"
          value={value}
          onChange={onChange}
        />
      </div>
      {showSearchDropdown && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-[80vh] w-full overflow-hidden overflow-y-auto rounded-lg border bg-white shadow-lg">
          <div className="p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-500">Tìm kiếm gần đây</h3>
            <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="cursor-pointer rounded border p-2 hover:bg-gray-50">
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
                <h3 className="mb-2 text-sm font-medium text-gray-500">Các điểm đến ở Việt Nam</h3>
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
                          <span className="font-normal text-gray-400">({city.count})</span>
                        </p>
                        <p className="text-xs text-gray-500">{city.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500">Các điểm đến quốc tế</h3>
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
                          <span className="font-normal text-gray-400">({city.count})</span>
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
  );
}

type CheckInCheckOutDatePickerProps = {
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
  className?: string;
};

function CheckInCheckOutDatePicker({
  dateRange,
  setDateRange,
  className,
}: CheckInCheckOutDatePickerProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <div className="col-span-2 flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm transition hover:shadow-md">
            <div className="flex w-1/2 items-center space-x-2 border-r pr-4">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-800">
                  {dateRange.from ? DateTimeUtils.formatDay(dateRange.from) : 'Chọn ngày'}
                </div>
                <div className="text-xs text-gray-500">
                  {dateRange.from ? DateTimeUtils.formatWeekday(dateRange.from) : ''}
                </div>
              </div>
            </div>
            <div className="flex w-1/2 items-center space-x-2 pl-4">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-800">
                  {dateRange.to ? DateTimeUtils.formatDay(dateRange.to) : 'Chọn ngày'}
                </div>
                <div className="text-xs text-gray-500">
                  {dateRange.to ? DateTimeUtils.formatWeekday(dateRange.to) : ''}
                </div>
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="mt-1 w-auto rounded-lg border bg-white p-0 shadow-lg">
          <Calendar
            locale={DateTimeUtils.dateTimeLocale}
            mode="range"
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => {
              if (range?.from && range?.to && differenceInDays(range.to, range.from) < 1) {
                setDateRange({
                  from: range.from,
                  to: addDays(range.from ?? new Date(), 1),
                });
                return;
              }

              setDateRange({
                from: range?.from ?? undefined,
                to: range?.to ?? undefined,
              });
            }}
            numberOfMonths={2}
            initialFocus
            disabled={(date) => date < new Date(new Date().toDateString())}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface OccupancyInputProps {
  numberOfPeople: number;
  rooms: number;
  onNumberOfPeople: (value: number) => void;
  onRoomsChange: (value: number) => void;
  className?: string;
}

function OccupancyInput({
  className,
  numberOfPeople,
  rooms,
  onNumberOfPeople,
  onRoomsChange,
}: OccupancyInputProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'border-input flex size-full cursor-pointer items-center rounded-md border bg-white px-4 pr-2 transition-all',
            'has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-ring/50 has-[input:focus-visible]:ring-[3px]',
            'has-[input[aria-invalid="true"]]:ring-danger/20 dark:has-[input[aria-invalid="true"]]:ring-danger/40 has-[input[aria-invalid="true"]]:border-danger',
            'py-2',
            className,
          )}
        >
          <Users className="text-muted-foreground" />
          <Input
            readOnly
            value={`${numberOfPeople} người ở, ${rooms} phòng`}
            className="cursor-pointer rounded-none border-0 text-base! shadow-none ring-0 focus-visible:ring-0"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="grid w-[var(--radix-popover-trigger-width)] gap-4">
        <div className="grid grid-cols-2 items-center">
          <div className="font-medium">Phòng</div>
          <div className="flex items-center space-x-4 justify-self-end">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={rooms <= 1}
              onClick={() => onRoomsChange(Math.max(1, rooms - 1))}
            >
              <MinusIcon />
            </Button>
            <span className="w-[1ch]! text-xl font-semibold">{rooms}</span>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => {
                onRoomsChange(rooms + 1);
                if (rooms + 1 > numberOfPeople) {
                  onNumberOfPeople(rooms + 1);
                }
              }}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="font-medium">Số người ở</div>
          <div className="flex items-center space-x-4 justify-self-end">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={numberOfPeople <= rooms}
              onClick={() => onNumberOfPeople(Math.max(1, numberOfPeople - 1))}
            >
              <MinusIcon />
            </Button>
            <span className="w-[1ch]! text-xl font-semibold">{numberOfPeople}</span>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => onNumberOfPeople(numberOfPeople + 1)}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SearchQueryEmptyDialog(props: React.ComponentProps<typeof AlertDialog>) {
  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Vui lòng nhập điểm du lịch hoặc tên khách sạn để tìm kiếm.
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel>Đóng</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CheckInCheckOutDateInvalidDialog(props: React.ComponentProps<typeof AlertDialog>) {
  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Vui lòng chọn ngày nhận phòng và trả phòng hợp lệ. Ngày trả phòng phải sau ngày nhận
            phòng ít nhất 1 ngày.
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel>Đóng</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

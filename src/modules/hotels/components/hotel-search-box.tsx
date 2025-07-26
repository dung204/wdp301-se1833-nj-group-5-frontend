'use client';

import { useQueries } from '@tanstack/react-query';
import { addDays, differenceInDays, format } from 'date-fns';
import { CalendarIcon, MapPin, MinusIcon, PlusIcon, Users } from 'lucide-react';
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
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/base/components/ui/command';
import { Input } from '@/base/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/base/components/ui/popover';
import { Skeleton } from '@/base/components/ui/skeleton';
import { useDebounce } from '@/base/hooks';
import { cn } from '@/base/lib';
import { DateTimeUtils } from '@/base/utils';
import { Province, provincesService } from '@/modules/provinces';

import { hotelsService } from '../services/hotels.service';
import { Hotel, hotelSearchParamsSchema } from '../types';

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

  const handleSearch = (searchResult?: SearchResult) => {
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
    if (searchResult) {
      searchParams.set('searchTerm', searchResult.data.name);
    }

    searchParams.set('checkIn', format(dateRange.from, 'yyyy-MM-dd'));
    searchParams.set('checkOut', format(dateRange.to, 'yyyy-MM-dd'));
    searchParams.set('rooms', rooms.toString());
    searchParams.set('occupancy', numberOfPeople.toString());

    if (searchResult && searchResult.type === 'hotel') {
      router.push(`/hotels/${searchResult.data.id}?${searchParams.toString()}`);
      return;
    }

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
                    <div className="relative col-span-1 h-14 md:col-span-3">
                      <SearchInput
                        value={searchQuery}
                        className="absolute inset-0"
                        onChange={setSearchQuery}
                        onResultClick={(result) => handleSearch(result)}
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

  const handleSearch = (searchResult?: SearchResult) => {
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
    if (searchResult) {
      searchParams.set('searchTerm', searchResult.data.name);
    }

    searchParams.set('checkIn', format(dateRange.from, 'yyyy-MM-dd'));
    searchParams.set('checkOut', format(dateRange.to, 'yyyy-MM-dd'));
    searchParams.set('rooms', rooms.toString());
    searchParams.set('occupancy', numberOfPeople.toString());

    if (searchResult && searchResult.type === 'hotel') {
      router.push(`/hotels/${searchResult.data.id}?${searchParams.toString()}`);
      return;
    }

    router.push(`/hotels?${searchParams.toString()}`);
  };

  return (
    <>
      <section className="bg-blue-900">
        <div className="mx-auto grid max-w-7xl grid-cols-24 items-center gap-2 px-4 py-2">
          <div className="relative col-span-7 h-14">
            <SearchInput
              value={searchQuery}
              className="absolute inset-0"
              onChange={setSearchQuery}
              onResultClick={(result) => handleSearch(result)}
            />
          </div>
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

type SearchResult =
  | {
      type: 'hotel';
      data: Hotel;
    }
  | {
      type: 'province';
      data: Province;
    };

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  onResultClick?: (result: SearchResult) => void;
}

function SearchInput({ value, className, onChange, onResultClick }: SearchInputProps) {
  const [showSearchDropdown, setShowSearchDropdown] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState(value ?? '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const searchResults = useQueries({
    queries: [
      {
        queryKey: ['hotels', 'all', { name: debouncedSearchTerm, pageSize: 6 }],
        queryFn: () => hotelsService.getAllHotels({ name: debouncedSearchTerm, pageSize: 6 }),
        enabled: debouncedSearchTerm !== '',
      },
      {
        queryKey: ['provinces', 'all', { searchTerm: debouncedSearchTerm }],
        queryFn: () => provincesService.getAllProvinces(debouncedSearchTerm),
        enabled: debouncedSearchTerm !== '',
      },
    ],
    combine: (results) => {
      if (debouncedSearchTerm === '') {
        return [];
      }

      const hotels = results[0].data?.data;
      const provinces = results[1].data;

      const combinedResults = [
        ...(hotels || []).map((hotel) => ({
          type: 'hotel',
          data: hotel,
        })),

        ...(provinces || []).map((province) => ({
          type: 'province',
          data: province,
        })),
      ] as SearchResult[];

      // return combinedResults.slice(0, 6); // Limit to 6 results

      return {
        data: combinedResults.slice(0, 6),
        isPending: results.some((result) => result.isPending),
      };
    },
  }) as { data?: SearchResult[]; isPending: boolean };

  const isSearching = searchTerm !== debouncedSearchTerm || searchResults.isPending;

  return (
    <Command
      shouldFilter={false}
      className={cn(
        'z-50 h-14 overflow-hidden border duration-300',
        {
          'h-max': showSearchDropdown,
        },
        className,
      )}
      onFocus={() => setShowSearchDropdown(true)}
      onBlur={() => setShowSearchDropdown(false)}
    >
      <CommandInput
        placeholder="Nhập điểm du lịch hoặc tên khách sạn"
        className="text-base"
        searchIconClassName="size-6"
        containerClassName={cn('gap-3 h-14 border-b border-b-transparent shrink-0', {
          'border-b-border': showSearchDropdown,
        })}
        value={searchTerm}
        onValueChange={(value) => {
          setSearchTerm(value);
          onChange?.(value);
        }}
      />
      <CommandList className="max-h-max">
        {isSearching ? (
          <CommandGroup>
            <div className="flex flex-col gap-2.5">
              <CommandItem className="pointer-events-none">
                <Skeleton className="h-5 w-1/2" />
              </CommandItem>
              <CommandItem className="pointer-events-none">
                <Skeleton className="h-5 w-1/2" />
              </CommandItem>
              <CommandItem className="pointer-events-none">
                <Skeleton className="h-5 w-1/2" />
              </CommandItem>
              <CommandItem className="pointer-events-none">
                <Skeleton className="h-5 w-1/2" />
              </CommandItem>
              <CommandItem className="pointer-events-none">
                <Skeleton className="h-5 w-1/2" />
              </CommandItem>
            </div>
          </CommandGroup>
        ) : (
          (searchResults.data || []).map((result) => {
            if (result.type === 'hotel') {
              return (
                <CommandItem
                  key={`hotel-${result.data.id}`}
                  className="flex cursor-pointer gap-2 select-none"
                  onSelect={() => onResultClick?.(result)}
                >
                  <div className="relative aspect-square w-14 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={result.data.images[0].url}
                      alt={result.data.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="line-clamp-1 text-base font-semibold">{result.data.name}</span>
                    <span className="text-muted-foreground line-clamp-1 text-sm">
                      Khách sạn ở {result.data.address}, {result.data.commune},{' '}
                      {result.data.province}
                    </span>
                  </div>
                </CommandItem>
              );
            }

            return (
              <CommandItem
                key={`province-${result.data.code}`}
                className="flex cursor-pointer items-center gap-2 select-none"
                onSelect={() => onResultClick?.(result)}
              >
                <div className="bg-accent flex aspect-square w-14 items-center justify-center overflow-hidden rounded-md">
                  <MapPin className="size-8 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold">{result.data.name}</span>
                  <span className="text-muted-foreground text-sm">Địa điểm</span>
                </div>
              </CommandItem>
            );
          })
        )}
      </CommandList>
    </Command>
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

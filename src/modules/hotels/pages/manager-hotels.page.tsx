'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { addDays, differenceInDays, format } from 'date-fns';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BedDouble,
  Building2,
  CalendarIcon,
  Clock,
  DoorClosed,
  Edit,
  Eye,
  FilterIcon,
  MapPin,
  MoreHorizontal,
  PhoneCall,
  Plus,
  PlusIcon,
  Star,
  Trash2,
  User,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ComponentProps, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Pagination } from '@/base/components/layout/pagination';
import { Badge } from '@/base/components/ui/badge';
import { Button } from '@/base/components/ui/button';
import { Calendar } from '@/base/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/base/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/base/components/ui/carousel';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/base/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/base/components/ui/dropdown-menu';
import { Form } from '@/base/components/ui/form';
import { Label } from '@/base/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/base/components/ui/popover';
import { Select } from '@/base/components/ui/select';
import { Separator } from '@/base/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/base/components/ui/table';
import { DateTimeUtils, StringUtils } from '@/base/utils';

import { HotelForm } from '../components/hotel-form';
import { useHotelMutations } from '../hooks/use-hotel-mutations';
import { hotelsService } from '../services/hotels.service';
import {
  CancelPolicy,
  CreateHotelSchema,
  Hotel,
  ManagerHotelSearchParams,
  UpdateHotelSchema,
  cancelPolicies,
} from '../types';
import { HotelUtils } from '../utils/hotel.utils';

type ManagerHotelsPageProps = {
  searchParams: ManagerHotelSearchParams;
};

type SortColumn = 'name' | 'address' | 'owner' | 'price';

const hotelFilterSchema = z.object({
  name: z.string().optional(),
  price: z.tuple([
    z.coerce.number().min(HotelUtils.DEFAULT_MIN_PRICE),
    z.coerce.number().max(HotelUtils.DEFAULT_MAX_PRICE),
  ]),
  cancelPolicy: z.nativeEnum(CancelPolicy).optional(),
  dateRange: z.tuple([z.date().optional(), z.date().optional()]).optional(),
});

export function ManagerHotelsPage({ searchParams }: ManagerHotelsPageProps) {
  const router = useRouter();
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const {
    data: {
      data: hotels,
      metadata: { pagination },
    },
  } = useSuspenseQuery({
    queryKey: ['hotels', 'admin', 'all', searchParams],
    queryFn: () => hotelsService.getHotelByAdmin(searchParams),
  });

  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({
    from: searchParams.checkIn ? new Date(searchParams.checkIn) : undefined,
    to: searchParams.checkOut ? new Date(searchParams.checkOut) : undefined,
  });

  const handleApplyFilters = (payload: z.infer<typeof hotelFilterSchema>) => {
    const {
      name,
      cancelPolicy,
      price: [minPrice, maxPrice],
      dateRange,
    } = payload;
    const url = new URL(window.location.href);

    if (name) {
      url.searchParams.set('name', name);
    } else {
      url.searchParams.delete('name');
    }

    url.searchParams.set('minPrice', minPrice.toString());
    url.searchParams.set('maxPrice', maxPrice.toString());

    if (cancelPolicy) {
      url.searchParams.set('cancelPolicy', cancelPolicy);
    } else {
      url.searchParams.delete('cancelPolicy');
    }

    if (dateRange?.[0]) url.searchParams.set('checkIn', format(dateRange?.[0], 'yyyy-MM-dd'));
    else url.searchParams.delete('checkIn');
    if (dateRange?.[1]) url.searchParams.set('checkOut', format(dateRange?.[1], 'yyyy-MM-dd'));
    else url.searchParams.delete('checkOut');

    router.push(url.href);
  };

  const handleFilterActive = (value: string | undefined) => {
    const url = new URL(window.location.href);

    if (value) {
      url.searchParams.set('isActive', value);
    } else {
      url.searchParams.delete('isActive');
    }

    router.push(url.href);
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'));
      if (sortDirection === 'desc') {
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column || !sortDirection) {
      return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="ml-1 h-4 w-4 text-blue-500" />;
    }
    return <ArrowDown className="ml-1 h-4 w-4 text-blue-500" />;
  };

  const sortedHotels = [...hotels].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    const dir = sortDirection === 'asc' ? 1 : -1;

    switch (sortColumn) {
      case 'name':
        return a.name.localeCompare(b.name) * dir;
      case 'address':
        return a.address.localeCompare(b.address) * dir;
      case 'owner':
        return (a.owner?.fullName ?? '').localeCompare(b.owner?.fullName ?? '') * dir;
      case 'price':
        return (a.priceHotel - b.priceHotel) * dir;
      default:
        return 0;
    }
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <Building2 className="h-8 w-8 text-blue-600" />
            Quản lý khách sạn
          </h1>
          <p className="mt-1 text-gray-600">Quản lý thông tin khách sạn và dịch vụ</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setAddDialogOpen(true)}>
          <Plus className="size-4" />
          Thêm khách sạn
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng khách sạn</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{pagination.total}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <div className="h-3 w-3 rounded-full bg-green-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <div className="h-6 w-1 rounded-full bg-blue-500"></div>
            Bộ lọc tìm kiếm
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form
            className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2"
            schema={hotelFilterSchema}
            defaultValues={{
              name: searchParams.name,
              price: [searchParams.minPrice, searchParams.maxPrice],
              cancelPolicy: searchParams.cancelPolicy,
              dateRange: [dateRange.from, dateRange.to],
            }}
            fields={[
              {
                name: 'name',
                type: 'text',
                label: 'Tên khách sạn',
                className: 'self-baseline col-span-1 row-start-1',
                placeholder: 'Nhập tên khách sạn',
                render: ({ Label, Control }) => (
                  <>
                    <Label className="text-base font-semibold text-gray-700" />
                    <Control />
                  </>
                ),
              },
              {
                name: 'cancelPolicy',
                type: 'select',
                label: 'Chính sách hủy phòng',
                className: 'self-baseline col-span-1 row-start-1',
                required: false,
                options: Object.entries(cancelPolicies).map(([value, label]) => ({
                  value,
                  label,
                })),
                placeholder: 'Chọn chính sách hủy phòng',
                searchable: false,
                clearable: true,
                render: ({ Label, Control }) => (
                  <>
                    <Label className="text-base font-semibold text-gray-700" />
                    <Control />
                  </>
                ),
              },
              {
                name: 'price',
                type: 'slider',
                label: 'Khoảng giá',
                className: 'self-baseline col-span-1 row-start-2',
                required: false,
                range: true,
                min: HotelUtils.DEFAULT_MIN_PRICE,
                max: HotelUtils.DEFAULT_MAX_PRICE,
                step: 50_000,
                numberFormat: (value) => StringUtils.formatCurrency(value.toString()),
                render: ({ Label, Control }) => (
                  <>
                    <Label className="text-base font-semibold text-gray-700" />
                    <Control />
                  </>
                ),
              },
              {
                name: 'dateRange',
                type: 'date',
                label: 'Khoảng ngày nhận/trả phòng',
                className: 'self-baseline col-span-1 row-start-2',

                render: ({ Label }: { Label: React.ComponentType<{ className?: string }> }) => (
                  <div className="space-y-2">
                    <Label className="text-base font-semibold text-gray-700" />
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm transition hover:shadow-md">
                          <div className="flex w-1/2 items-center space-x-2 border-r pr-4">
                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                            <div>
                              <div className="text-sm font-medium text-gray-800">
                                {dateRange.from
                                  ? DateTimeUtils.formatDay(dateRange.from)
                                  : 'Chọn ngày'}
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
                            if (
                              range?.from &&
                              range?.to &&
                              differenceInDays(range.to, range.from) < 1
                            ) {
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
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                ),
              },
            ]}
            renderSubmitButton={(Button) => (
              <div className="col-span-3 flex items-center justify-center">
                <Button>
                  <FilterIcon />
                  Áp dụng bộ lọc
                </Button>
              </div>
            )}
            onSuccessSubmit={(payload) => {
              handleApplyFilters({
                ...payload,
                dateRange: [dateRange.from, dateRange.to],
              });
            }}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Danh sách khách sạn</CardTitle>
          <Select
            triggerClassName="w-48"
            options={[
              { value: 'all', label: 'Tất cả' },
              { value: 'true', label: 'Đang hoạt động' },
              { value: 'false', label: 'Ngừng hoạt động' },
            ]}
            clearable={false}
            searchable={false}
            value={searchParams.isActive}
            onChange={handleFilterActive}
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {sortedHotels.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center">
                <Image src="/result-not-found.svg" alt="not found" width={200} height={200} />
                <p>
                  Không tìm thấy khách sạn nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử
                  lại với các tiêu chí khác.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    {/* <TableHead className="font-semibold">#</TableHead> */}
                    <TableHead
                      onClick={() => handleSort('name')}
                      className="cursor-pointer font-semibold select-none"
                    >
                      <div className="flex items-center">Tên khách sạn {getSortIcon('name')}</div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort('address')}
                      className="cursor-pointer font-semibold select-none"
                    >
                      <div className="flex items-center">Địa chỉ {getSortIcon('address')}</div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort('owner')}
                      className="cursor-pointer font-semibold select-none"
                    >
                      <div className="flex items-center">Chủ sở hữu {getSortIcon('owner')}</div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort('price')}
                      className="cursor-pointer font-semibold select-none"
                    >
                      <div className="flex items-center">Giá {getSortIcon('price')}</div>
                    </TableHead>
                    <TableHead className="font-semibold">Tổng số phòng</TableHead>
                    <TableHead className="font-semibold">Số phòng được đặt</TableHead>
                    <TableHead className="font-semibold">Check-in</TableHead>
                    <TableHead className="font-semibold">Check-out</TableHead>
                    <TableHead className="text-center font-semibold">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedHotels.map((hotel) => (
                    <TableRow key={hotel.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{hotel.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="mr-1 h-4 w-4" />
                          <span className="max-w-[200px] truncate">{hotel.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-600">
                          <User className="mr-1 h-4 w-4" />
                          {hotel.owner.fullName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-600">
                          <User className="mr-1 h-4 w-4" />
                          {hotel?.priceHotel.toLocaleString('vi-VN')}đ
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center text-gray-600">
                          <BedDouble className="mr-1 h-4 w-4" />
                          {hotel?.rooms.totalRooms} phòng
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center text-gray-600">
                          <DoorClosed className="mr-1 h-4 w-4" />
                          {hotel?.rooms.bookedRooms} phòng
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center text-gray-600">
                          <Clock className="mr-1 h-4 w-4" />
                          <span className="text-sm">
                            {DateTimeUtils.formatTime(new Date(hotel.checkinTime.from))} -{' '}
                            {DateTimeUtils.formatTime(new Date(hotel.checkinTime.to))}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-600">
                          <Clock className="mr-1 h-4 w-4" />
                          <span className="text-sm">
                            {DateTimeUtils.formatTime(new Date(hotel.checkoutTime))}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedHotel(hotel);
                                setDetailsDialogOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedHotel(hotel);
                                setEditDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedHotel(hotel);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <div className="mt-4">
            <Pagination pagination={pagination} />
          </div>
        </CardContent>
      </Card>

      <AddHotelDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <EditHotelDialog
        hotel={selectedHotel}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <HotelDetailsDialog
        hotel={selectedHotel}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
      <ConfirmDeleteHotelDialog
        hotelToDelete={selectedHotel}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  );
}

interface AddHotelDialogProps extends ComponentProps<typeof Dialog> {
  onSuccess?: (hotel: Hotel) => void;
}

function AddHotelDialog({ onSuccess, ...props }: AddHotelDialogProps) {
  const {
    createHotel: { mutate: triggerCreateHotel, isPending },
  } = useHotelMutations({
    onAddOrUpdateSuccess: (hotel) => {
      props.onOpenChange?.(false);
      onSuccess?.(hotel);
    },
  });

  return (
    <Dialog {...props}>
      <DialogContent className="max-h-[90vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusIcon />
            Thêm khách sạn mới
          </DialogTitle>
        </DialogHeader>

        <HotelForm
          loading={isPending}
          defaultValues={{
            images: {
              newImages: [],
              imagesToDelete: [],
            },
          }}
          renderSubmitButton={(SubmitButton) => (
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </DialogClose>
              <SubmitButton>Thêm khách sạn</SubmitButton>
            </DialogFooter>
          )}
          onSuccessSubmit={(payload) => triggerCreateHotel(payload as CreateHotelSchema)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface EditHotelDialogProps extends ComponentProps<typeof Dialog> {
  hotel: Hotel | null;
  onSuccess?: (hotel: Hotel) => void;
}

function EditHotelDialog({ hotel, onSuccess, ...props }: EditHotelDialogProps) {
  const {
    updateHotel: { mutate: triggerUpdateHotel, isPending },
  } = useHotelMutations({
    onAddOrUpdateSuccess: (hotel) => {
      props.onOpenChange?.(false);
      onSuccess?.(hotel);
    },
  });

  return (
    <Dialog {...props}>
      <DialogContent className="max-h-[90vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit />
            Chỉnh sửa khách sạn
          </DialogTitle>
        </DialogHeader>

        <HotelForm
          defaultValues={{
            ...hotel,
            checkinTime: {
              from: new Date(hotel?.checkinTime.from || ''),
              to: new Date(hotel?.checkinTime.to || ''),
            },
            checkoutTime: new Date(hotel?.checkoutTime || ''),
            // Set default values for province and commune fields from existing hotel data
            province: hotel?.province || '',
            commune: hotel?.commune || '',
            images: {
              newImages: (hotel?.images || []).map((image) => ({
                file: null,
                fileName: image.fileName,
                previewUrl: image.url,
              })),
              imagesToDelete: [],
            },
          }}
          onSuccessSubmit={(payload) =>
            triggerUpdateHotel({ id: hotel?.id || '', ...(payload as UpdateHotelSchema) })
          }
          loading={isPending}
          renderSubmitButton={(SubmitButton) => (
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </DialogClose>
              <SubmitButton>Lưu thông tin</SubmitButton>
            </DialogFooter>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}

interface HotelDetailsDialogProps extends ComponentProps<typeof Dialog> {
  hotel: Hotel | null;
}

function HotelDetailsDialog({ hotel, ...props }: HotelDetailsDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[95vh] w-screen max-w-[90vw] overflow-y-auto p-0"
      >
        <DialogHeader className="rounded-t-lg bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="rounded-full bg-white/20 p-2">
              <Eye className="h-5 w-5" />
            </div>
            Thông tin chi tiết khách sạn
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          {hotel && (
            <div className="space-y-6">
              <div className="space-y-6">
                <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-lg">
                  {hotel.images.length !== 0 ? (
                    <Carousel className="size-full">
                      <CarouselContent>
                        {hotel.images.map((image) => (
                          <CarouselItem key={crypto.randomUUID()} className="relative h-64">
                            <Image
                              src={image.url}
                              alt={hotel.name}
                              fill
                              className="object-cover object-center"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselNext className="right-2" />
                      <CarouselPrevious className="left-2" />
                    </Carousel>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                      Không có ảnh
                    </div>
                  )}
                </div>

                {/* Thông tin khách sạn */}
                <div className="space-y-4 px-2">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Tên khách sạn: {hotel.name}
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-semibold">{hotel.rating}</span>
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Đang hoạt động
                      </Badge>
                    </div>
                  </div>

                  {/* Địa chỉ */}
                  <div className="flex items-start gap-2 text-gray-700">
                    <MapPin className="mt-0.5 h-5 w-5 text-emerald-600" />
                    Địa chỉ:
                    <p>{hotel.address}</p>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <PhoneCall className="mt-0.5 h-5 w-5 text-emerald-600" />
                    Số điện thoại:
                    <p>{hotel.phoneNumber}</p>
                  </div>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <User className="h-5 w-5 text-gray-600" />
                    Chủ sở hữu:
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{hotel.owner.fullName}</p>
                    </div>
                  </h3>
                  <div className="space-y-3"></div>
                </div>
              </div>

              <Separator />
              <Card>
                <CardContent className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Clock className="h-5 w-5 text-gray-600" />
                    Giờ hoạt động
                  </h3>
                  <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Check-in</Label>
                      <p className="font-semibold text-blue-700">
                        {DateTimeUtils.formatTime(new Date(hotel.checkinTime.from))} -{' '}
                        {DateTimeUtils.formatTime(new Date(hotel.checkinTime.to))}
                      </p>
                    </div>
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Check-out</Label>
                      <p className="font-semibold text-orange-700">
                        {DateTimeUtils.formatTime(new Date(hotel.checkoutTime))}
                      </p>
                    </div>
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Tiện nghi khách sạn</h3>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {hotel.services.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                      >
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className="mt-6 mb-4 text-lg font-semibold text-gray-900">
                    Chính sách hủy phòng
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-700">{cancelPolicies[hotel.cancelPolicy]}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Mô tả khách sạn</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="leading-relaxed text-gray-700">
                      {hotel.description || 'Không có mô tả'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="border-t bg-gray-50 p-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Cập nhật lần cuối: Hôm nay</span>
              <Badge variant="outline" className="border-green-600 text-green-600">
                Đã xác thực
              </Badge>
            </div>
            <div className="flex gap-3">
              <DialogClose asChild>
                <Button variant="outline">Đóng</Button>
              </DialogClose>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ConfirmDeleteHotelDialogProps extends ComponentProps<typeof Dialog> {
  hotelToDelete: Hotel | null;
}

function ConfirmDeleteHotelDialog({ hotelToDelete, ...props }: ConfirmDeleteHotelDialogProps) {
  const {
    deleteHotel: { mutate: triggerDeleteHotel, isPending },
  } = useHotelMutations({
    onDeleteSuccess: () => {
      props.onOpenChange?.(false);
      toast.success('Xóa khách sạn thành công');
    },
  });

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Xác nhận xóa khách sạn
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600">
            Bạn có chắc chắn muốn xóa khách sạn{' '}
            <span className="font-semibold text-gray-900">{hotelToDelete?.name}</span> không?
          </p>
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Hủy
            </Button>
          </DialogClose>
          <Button
            variant="danger"
            onClick={() => triggerDeleteHotel(hotelToDelete?.id as string)}
            loading={isPending}
          >
            Xóa khách sạn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

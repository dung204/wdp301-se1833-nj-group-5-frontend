'use client';

import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import {
  Bed,
  Car,
  Clock,
  Coffee,
  Dumbbell,
  MapPin,
  Phone,
  StarIcon,
  Ticket,
  Tv,
  Utensils,
  Waves,
  Wifi,
  Wind,
} from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { Suspense, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Badge } from '@/base/components/ui/badge';
import { Card, CardContent } from '@/base/components/ui/card';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/base/components/ui/carousel';
import { DiscountState, discountService } from '@/modules/discount';
import { DiscountCard, DiscountCardSkeleton } from '@/modules/discount/components/discount-card';
import { Room, RoomSearchParams } from '@/modules/rooms';
import { RoomCard, RoomCardSkeleton } from '@/modules/rooms/components/room-card';
import { roomsService } from '@/modules/rooms/services/rooms.service';

import { HotelSearchBoxSmall } from '../components/hotel-search-box';
import { hotelsService } from '../services/hotels.service';

type HotelDetailsPageProps = {
  searchParams: Omit<RoomSearchParams, 'page' | 'pageSize'>;
  hotelId: string;
};

const iconMap: { [key: string]: React.ElementType } = {
  wifi: Wifi,
  parking: Car,
  breakfast: Coffee,
  gym: Dumbbell,
  pool: Waves,
  restaurant: Utensils,
  tv: Tv,
  ac: Wind,
  phone: Phone,
};

function getAmenityIcon(amenity: string) {
  const IconComponent = iconMap[amenity.toLowerCase()] || Coffee;
  return <IconComponent className="h-4 w-4" />;
}

export function HotelDetailsPage({ searchParams, hotelId }: HotelDetailsPageProps) {
  const {
    data: { data: hotels },
  } = useSuspenseQuery({
    queryKey: ['hotels', 'all', { id: hotelId }],
    queryFn: () => hotelsService.getAllHotels({ id: hotelId }),
  });

  const hotel = hotels?.[0]; // Assuming single hotel data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <HotelSearchBoxSmall />
      <div className="mx-auto max-w-7xl space-y-12 p-6">
        {/* Hotel Information Section */}
        {hotel && (
          <div className="relative">
            <Card className="overflow-hidden border-0 bg-white/80 shadow-xl backdrop-blur-sm">
              {/* Hotel Images Grid */}
              <div className="relative">
                <div className="grid h-96 grid-cols-4 grid-rows-2 gap-3 p-4">
                  {/* Main large image */}
                  <div className="group relative col-span-2 row-span-2 overflow-hidden rounded-xl">
                    {Array.isArray(hotel.images) && hotel.images[0] && (
                      <Image
                        src={hotel.images[0].url || '/placeholder.svg'}
                        alt="Ảnh chính khách sạn"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Smaller images */}
                  {Array.isArray(hotel.images) &&
                    hotel.images.slice(1, 7).map((image, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-xl">
                        <Image
                          src={image.url || '/placeholder.svg'}
                          alt={`Ảnh khách sạn ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                    ))}
                </div>

                {/* Hotel name overlay */}
                <div className="absolute bottom-6 left-6 rounded-2xl bg-white/95 px-6 py-4 shadow-lg backdrop-blur-sm">
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">{hotel.name}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">{hotel.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <StarIcon
                            key={i}
                            size={16}
                            className={
                              hotel.rating >= i
                                ? 'fill-yellow-400 text-yellow-400'
                                : hotel.rating >= i - 0.5
                                  ? 'fill-yellow-400 text-yellow-400 opacity-50'
                                  : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-sm font-semibold text-gray-700">
                        {hotel.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-8">
                <div className="grid gap-8 lg:grid-cols-3">
                  {/* Description */}
                  <div className="space-y-6 lg:col-span-2">
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                        <div className="h-6 w-1 rounded-full bg-blue-600"></div>
                        Mô tả khách sạn
                      </h3>
                      <p className="text-base leading-relaxed text-gray-600">
                        {hotel.description ||
                          'Khách sạn sang trọng với đầy đủ tiện nghi hiện đại, phục vụ tận tình và vị trí thuận lợi. Không gian thoải mái, dịch vụ chuyên nghiệp, mang đến trải nghiệm nghỉ dưỡng tuyệt vời cho quý khách.'}
                      </p>
                    </div>

                    {/* Amenities */}
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                        <div className="h-6 w-1 rounded-full bg-green-600"></div>
                        Tiện nghi khách sạn
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {hotel.services?.map((amenity: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                              {getAmenityIcon(amenity)}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{amenity}</span>
                          </div>
                        )) || (
                          <>
                            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                <Wifi className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                WiFi miễn phí
                              </span>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                <Car className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">Bãi đỗ xe</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                <Coffee className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">Ăn sáng</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Check-in/out Info */}
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Thời gian nhận/trả phòng
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-xl bg-white p-3">
                          <span className="text-sm font-medium text-gray-600">Check-in:</span>
                          <span className="text-sm font-bold text-gray-900">
                            {new Date(hotel.checkinTime.from).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            -{' '}
                            {new Date(hotel.checkinTime.to).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-white p-3">
                          <span className="text-sm font-medium text-gray-600">Check-out:</span>
                          <span className="text-sm font-bold text-gray-900">
                            {new Date(hotel.checkoutTime).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Suspense>
          <DiscountsSection hotelId={hotelId} />
        </Suspense>

        <Suspense>
          <RoomsSection hotelId={hotelId} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

function DiscountsSection({ hotelId }: { hotelId: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const {
    data: { pages },
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ['discounts', 'all', { hotelId, state: DiscountState.ACTIVE }],
    queryFn: ({ pageParam }) =>
      discountService.getAllDiscounts({
        hotelId,
        page: pageParam,
        pageSize: 3,
        state: DiscountState.ACTIVE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metadata.pagination.hasNextPage
        ? lastPage.metadata.pagination.currentPage + 1
        : undefined,
  });

  const discounts = pages.flatMap((page) => page.data);
  const totalDiscounts = pages.at(-1)?.metadata.pagination.total || 0;

  useEffect(() => {
    if (!api) return;

    api.on('scroll', async () => {
      const lastSlide = api?.slideNodes().length - 1;
      const lastSlideInView = api?.slidesInView().includes(lastSlide);

      if (lastSlideInView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
  }, [api, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Mã giảm giá cho khách sạn này</h2>
          <p className="text-gray-600">
            Đặt phòng ngay hôm nay để nhận ưu đãi đặc biệt từ khách sạn
          </p>
        </div>
        <div className="flex items-start gap-4">
          <Badge variant="outline" className="bg-white px-4 py-2 text-base font-medium">
            <Ticket className="mr-2 h-4 w-4" />
            {totalDiscounts} mã giảm giá có sẵn
          </Badge>
        </div>
      </div>
      {discounts.length !== 0 ? (
        <Carousel
          setApi={setApi}
          opts={{
            duration: 20,
          }}
        >
          <CarouselContent>
            {discounts.map((discount) => (
              <CarouselItem key={discount.id} className="basis-1/3">
                <DiscountCard discount={discount} />
              </CarouselItem>
            ))}
            {hasNextPage && (
              <CarouselItem className="basis-1/3">
                <DiscountCardSkeleton />
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <div className="text-center">
          <div className="mx-auto max-w-md rounded-2xl bg-white/80 p-12 backdrop-blur-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Ticket className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Không có mã giảm giá nào</h3>
            <p className="mb-6 text-gray-600">
              Hiện tại không có mã giảm giá nào cho khách sạn này. Hãy kiểm tra lại sau hoặc liên hệ
              với khách sạn để biết thêm thông tin.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function RoomsSection({ hotelId, searchParams }: HotelDetailsPageProps) {
  const { inView, ref } = useInView();
  const {
    data: { pages },
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ['rooms', 'all', { hotelId, ...searchParams }],
    queryFn: ({ pageParam }) =>
      roomsService.getAllRooms({ ...searchParams, hotel: hotelId, page: pageParam, pageSize: 3 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metadata.pagination.hasNextPage
        ? lastPage.metadata.pagination.currentPage + 1
        : undefined,
  });

  const rooms = pages.flatMap((page) => page.data);
  const totalRooms = pages.at(-1)?.metadata.pagination.total || 0;

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Danh sách phòng</h2>
          <p className="text-gray-600">Chọn phòng phù hợp với nhu cầu của bạn</p>
        </div>
        <div className="flex items-start gap-4">
          <Badge variant="outline" className="bg-white px-4 py-2 text-base font-medium">
            <Bed className="mr-2 h-4 w-4" />
            {totalRooms} phòng có sẵn
          </Badge>
        </div>
      </div>

      {rooms.length !== 0 ? (
        <div className="space-y-6">
          {rooms?.map((room: Room) => <RoomCard key={room.id} room={room} />)}
          {hasNextPage && (
            <>
              <RoomCardSkeleton />
              <div ref={ref}></div>
            </>
          )}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="mx-auto max-w-md rounded-2xl bg-white/80 p-12 backdrop-blur-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Bed className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Không có phòng nào</h3>
            <p className="mb-6 text-gray-600">
              Không tìm thấy phòng nào phù hợp với tiêu chí tìm kiếm của bạn
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import {
  Bed,
  Car,
  CheckCircle,
  Clock,
  Coffee,
  CreditCard,
  Dumbbell,
  MapPin,
  Maximize,
  Phone,
  StarIcon,
  Tv,
  Users,
  Utensils,
  Waves,
  Wifi,
  Wind,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

import { Badge } from '@/base/components/ui/badge';
import { Button } from '@/base/components/ui/button';
import { Card, CardContent } from '@/base/components/ui/card';
import { hotelsService } from '@/modules/hotels';
import { roomsService } from '@/modules/rooms/services/rooms.service';

import type { Room, RoomSearchParams } from '../types';

type RoomsPageProps = {
  searchParams: RoomSearchParams;
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

export function RoomsPage({ searchParams, hotelId }: RoomsPageProps) {
  const router = useRouter();
  const [_, setPage] = useState(1);
  const {
    data: { data: hotels },
  } = useSuspenseQuery({
    queryKey: ['hotels', 'all', { id: hotelId }],
    queryFn: () => hotelsService.getAllHotels({ id: hotelId }),
  });

  const {
    data: {
      data: rooms,
      metadata: { pagination },
    },
  } = useSuspenseQuery({
    queryKey: ['rooms', 'all', { ...searchParams, hotel: hotelId }],
    queryFn: () => roomsService.getAllRooms({ ...searchParams, hotel: hotelId }),
  });

  const hotel = hotels?.[0]; // Assuming single hotel data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto max-w-7xl space-y-8 p-6">
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
                        src={hotel.images[0] || '/placeholder.svg'}
                        alt="Ảnh chính khách sạn"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Smaller images */}
                  {Array.isArray(hotel.images) &&
                    hotel.images.slice(1, 7).map((imgUrl, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-xl">
                        <Image
                          src={imgUrl || '/placeholder.svg'}
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

        {/* Rooms Section */}
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">Danh sách phòng</h2>
              <p className="text-gray-600">Chọn phòng phù hợp với nhu cầu của bạn</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-white px-4 py-2 text-base font-medium">
                <Bed className="mr-2 h-4 w-4" />
                {pagination?.total || 0} phòng có sẵn
              </Badge>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="space-y-6">
            {rooms?.map((room: Room) => (
              <Card
                key={room.id}
                className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
              >
                <div className="lg:flex">
                  {/* Room Image */}
                  <div className="relative h-64 overflow-hidden lg:h-auto lg:w-96">
                    {/* <Image
                      src={Array.isArray(room.images) ? room.images[0] : room.images}
                      alt={room.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    /> */}
                    {room.isSoldOut && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <div className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 font-semibold text-white">
                          <XCircle className="h-4 w-4" />
                          Hết phòng
                        </div>
                      </div>
                    )}
                    {!room.isSoldOut && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-green-500 text-white hover:bg-green-600">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Còn phòng
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Room Details */}
                  <div className="flex-1 p-8">
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-2 text-2xl font-bold text-gray-900">{room.name}</h3>
                        <div className="mb-4 flex items-center gap-4 text-gray-600">
                          <div className="flex items-center gap-1">
                            <Maximize className="h-4 w-4" />
                            <span className="text-sm">{room.size} m²</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">Tối đa {room.maxQuantity} người</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="mb-1 text-3xl font-bold text-blue-600">
                          {room.rate?.toLocaleString('vi-VN')}₫
                        </div>
                        <div className="text-sm text-gray-500">/ đêm</div>
                      </div>
                    </div>

                    {/* Room Amenities */}
                    <div className="mb-6">
                      <h4 className="mb-3 text-lg font-semibold text-gray-900">Tiện nghi phòng</h4>
                      <div className="flex flex-wrap gap-2">
                        {room.services?.map((amenity: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-gray-200 bg-gray-50 px-3 py-1 hover:bg-gray-100"
                          >
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Availability Info */}
                    <div className="mb-6 grid grid-cols-3 gap-4">
                      <div className="rounded-xl bg-gray-50 p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {room.availability.total}
                        </div>
                        <div className="text-sm text-gray-600">Tổng số phòng</div>
                      </div>
                      <div className="rounded-xl bg-orange-50 p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {room.availability.booked}
                        </div>
                        <div className="text-sm text-gray-600">Đã đặt</div>
                      </div>
                      <div
                        className={`rounded-xl p-4 text-center ${+room.availability.available === 0 ? 'bg-red-50' : 'bg-green-50'}`}
                      >
                        <div
                          className={`text-2xl font-bold ${+room.availability.available === 0 ? 'text-red-600' : 'text-green-600'}`}
                        >
                          {room.availability.available}
                        </div>
                        <div className="text-sm text-gray-600">Còn lại</div>
                      </div>
                    </div>

                    {/* Booking Button */}
                    <div className="flex justify-center">
                      <Button
                        className={`rounded-xl px-8 py-3 text-base font-semibold transition-all duration-300 ${
                          room.isSoldOut
                            ? 'cursor-not-allowed bg-gray-300 hover:bg-gray-300'
                            : 'transform bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
                        }`}
                        disabled={room.isSoldOut}
                      >
                        <CreditCard className="mr-2 h-5 w-5" />
                        {room.isSoldOut ? 'Hết phòng' : 'Đặt phòng ngay'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white/80 p-6 backdrop-blur-sm">
              <div className="text-gray-600">
                Trang <span className="font-semibold">{pagination.currentPage}</span> /{' '}
                <span className="font-semibold">{pagination.totalPage}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="hover:border-blue-200 hover:bg-blue-50"
                >
                  Trang trước
                </Button>

                {Array.from({ length: Math.min(5, pagination.totalPage) }, (_, i) => {
                  const pageNumber = i + Math.max(1, pagination.currentPage - 2);
                  return pageNumber <= pagination.totalPage ? (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === pagination.currentPage ? 'default' : 'outline'}
                      onClick={() => setPage(pageNumber)}
                      className={
                        pageNumber === pagination.currentPage
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'hover:border-blue-200 hover:bg-blue-50'
                      }
                    >
                      {pageNumber}
                    </Button>
                  ) : null;
                })}

                <Button
                  variant="outline"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="hover:border-blue-200 hover:bg-blue-50"
                >
                  Trang sau
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!rooms || rooms.length === 0) && (
            <div className="py-16 text-center">
              <div className="mx-auto max-w-md rounded-2xl bg-white/80 p-12 backdrop-blur-sm">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Bed className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">Không có phòng nào</h3>
                <p className="mb-6 text-gray-600">
                  Không tìm thấy phòng nào phù hợp với tiêu chí tìm kiếm của bạn
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="hover:bg-blue-50"
                >
                  Quay lại tìm kiếm
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

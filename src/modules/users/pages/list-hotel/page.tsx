'use client';

import { useQuery } from '@tanstack/react-query';
import { Heart, MapPin, Search, Star } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { Button } from '@/base/components/ui/button';
import { Card, CardContent } from '@/base/components/ui/card';
import { Input } from '@/base/components/ui/input';
import { Slider } from '@/base/components/ui/slider';
import { hotelService } from '@/modules/manager/services/hotel.service';

import { HotelSkeleton } from './HotelSkeleton';

export function ListHotel() {
  const [priceRange, setPriceRange] = React.useState([0, 5000000]);
  const [sortBy, setSortBy] = React.useState('price-low');
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data: hotelData, isLoading } = useQuery({
    queryKey: ['hotels'],
    queryFn: () => hotelService.getAllHotels(),
  });

  const hotels = hotelData?.data ?? [];
  const filteredHotels = hotels
    // .filter(hotel => hotel.price >= priceRange[0] && hotel.price <= priceRange[1])
    .filter((hotel) => hotel.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <div className="border-l-4 border-red-500 bg-red-50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white">
              !
            </div>
            <div>
              <p className="font-medium text-red-700">
                Nhanh lên! 91% chỗ nghỉ trên trang của chúng tôi đã kín phòng
              </p>
              <p className="text-sm text-red-600">
                Phòng ở Hà Nội đang bán rất chạy vào ngày bạn chọn. Nhanh tay đặt trước khi giá
                tăng.
              </p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-2">Thời gian đến ngày nhận phòng</span>
            <div className="flex">
              <div className="min-w-[40px] rounded bg-red-500 px-2 py-1 text-center text-white">
                <div className="font-bold">00</div>
                <div className="text-xs">ngày</div>
              </div>
              <div className="min-w-[40px] rounded bg-red-500 px-2 py-1 text-center text-white">
                <div className="font-bold">14</div>
                <div className="text-xs">giờ</div>
              </div>
              <div className="min-w-[40px] rounded bg-red-500 px-2 py-1 text-center text-white">
                <div className="font-bold">39</div>
                <div className="text-xs">phút</div>
              </div>
              <div className="min-w-[40px] rounded bg-red-500 px-2 py-1 text-center text-white">
                <div className="font-bold">26</div>
                <div className="text-xs">giây</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* FilterFilter */}
            <div className="w-80 flex-shrink-0">
              <Card>
                <CardContent>
                  {/* Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Tìm kiếm khách sạn"
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Price Range */}
                  <div>
                    <h3 className="mb-3 font-medium">Giá</h3>
                    <div className="space-y-3">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        step={50000}
                        max={5000000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm">
                        <span>TỐI THIỂU</span>
                        <span>TỐI ĐA</span>
                      </div>
                      <div className="flex gap-2">
                        <Input value={priceRange[0]} className="text-center" readOnly />
                        <span className="self-center">-</span>
                        <Input
                          value={priceRange[1].toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                          className="text-center"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ListList */}
            <div className="flex-1">
              {/* Sort */}
              <div className="mb-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-sm font-medium">Sắp xếp theo</span>
                  <div className="flex gap-2">
                    <Button
                      variant={sortBy === 'recommended' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('recommended')}
                    >
                      Phù hợp nhất
                    </Button>
                    <Button
                      variant={sortBy === 'price-low' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('price-low')}
                    >
                      Giá thấp nhất trước
                    </Button>
                  </div>
                </div>
              </div>
              {isLoading ? (
                // Show 3 skeleton items while loading
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <HotelSkeleton key={i} />
                  ))}
                </div>
              ) : (
                // Show actual hotel list
                filteredHotels.map((hotel) => (
                  <Card
                    key={hotel.id}
                    className="mb-4 overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Left side - Image */}
                        <div className="relative h-48 w-full flex-shrink-0 sm:w-64">
                          <Image
                            src={Array.isArray(hotel.avatar) ? hotel.avatar[0] : hotel.avatar}
                            alt={hotel.name}
                            fill
                            className="object-cover"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Right side - Content */}
                        <div className="flex flex-1 flex-col p-4 sm:p-5">
                          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                            {/* Hotel details */}
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
                              <div className="flex items-center text-gray-600">
                                <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
                                <span className="text-sm">{hotel.address}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-blue-600">
                                  {hotel.rating.toFixed(1)}
                                </span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
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
                              </div>
                              <p className="line-clamp-2 text-sm text-gray-600">
                                {hotel.description}
                              </p>
                            </div>

                            {/* Check-in/out times */}
                            <div className="space-y-2 rounded-lg bg-gray-50 lg:min-w-[200px]">
                              <div className="flex items-center">
                                <span className="w-20 text-sm text-gray-600">Check-in:</span>
                                <span className="text-sm font-medium">
                                  {new Date(hotel.checkinTime.from).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                  h -
                                  {new Date(hotel.checkinTime.to).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                  h
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-20 text-sm text-gray-600">Check-out:</span>
                                <span className="text-sm font-medium">
                                  {new Date(hotel.checkoutTime).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                  h
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Services */}
                          {hotel.services && hotel.services.length > 0 && (
                            <div className="mt-4">
                              <div className="flex flex-wrap items-center gap-1">
                                <span className="text-sm font-medium text-gray-700">Dịch vụ:</span>
                                <div className="flex flex-wrap gap-1">
                                  {hotel.services.map((item, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="mt-auto flex items-center justify-between pt-4">
                            {/* Price section - uncomment if needed */}
                            {/* <div className="flex flex-col">
                    {hotel.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {hotel.originalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}/đêm
                      </span>
                    )}
                    <span className="text-lg font-bold text-blue-600">
                      {hotel.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}/đêm
                    </span>
                  </div> */}

                            <div className="ml-auto flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <Heart className="mr-1 h-4 w-4" />
                                <span className="hidden sm:inline">Thêm vào yêu thích</span>
                                <span className="inline sm:hidden">Yêu thích</span>
                              </Button>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Xem chi tiết
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

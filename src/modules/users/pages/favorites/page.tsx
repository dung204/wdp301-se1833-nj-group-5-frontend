'use client';

import { Heart, MapPin, Star, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Badge } from '@/base/components/ui/badge';
import { Button } from '@/base/components/ui/button';
import { Card, CardContent } from '@/base/components/ui/card';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  image: string;
  amenities: string[];
  description: string;
  discount?: number;
}
export function Favorites() {
  const [favoriteHotels, setFavoriteHotels] = React.useState<Hotel[]>([
    {
      id: '1',
      name: 'Anantara Mui Ne Resort',
      location: 'Phan Thiết, Bình Thuận',
      rating: 4.5,
      reviewCount: 1234,
      price: 2500000,
      originalPrice: 3200000,
      image: '/placeholder.svg?height=300&width=400',
      amenities: ['wifi', 'pool', 'parking', 'breakfast'],
      description: 'Resort sang trọng bên bờ biển với view tuyệt đẹp',
      discount: 22,
    },
    {
      id: '2',
      name: 'Sailing Club Resort Mui Ne',
      location: 'Phan Thiết, Bình Thuận',
      rating: 4.3,
      reviewCount: 856,
      price: 1800000,
      originalPrice: 2200000,
      image: '/placeholder.svg?height=300&width=400',
      amenities: ['wifi', 'pool', 'breakfast'],
      description: 'Resort bãi biển với nhiều hoạt động thể thao nước',
      discount: 18,
    },
    {
      id: '3',
      name: 'Victoria Phan Thiet Beach Resort & Spa',
      location: 'Phan Thiết, Bình Thuận',
      rating: 4.2,
      reviewCount: 642,
      price: 2200000,
      image: '/placeholder.svg?height=300&width=400',
      amenities: ['wifi', 'pool', 'parking', 'breakfast'],
      description: 'Resort spa cao cấp với dịch vụ chăm sóc sức khỏe',
    },
    {
      id: '4',
      name: 'Pandanus Resort',
      location: 'Phan Thiết, Bình Thuận',
      rating: 4.0,
      reviewCount: 423,
      price: 1500000,
      originalPrice: 1800000,
      image: '/placeholder.svg?height=300&width=400',
      amenities: ['wifi', 'pool'],
      description: 'Resort gia đình với không gian xanh mát',
      discount: 17,
    },
    {
      id: '5',
      name: 'Seahorse Resort & Spa',
      location: 'Phan Thiết, Bình Thuận',
      rating: 4.1,
      reviewCount: 567,
      price: 1900000,
      image: '/placeholder.svg?height=300&width=400',
      amenities: ['wifi', 'pool', 'breakfast'],
      description: 'Resort yên tĩnh với thiết kế hiện đại',
    },
  ]);
  const removeFavorite = (hotelId: string) => {
    setFavoriteHotels(favoriteHotels.filter((hotel) => hotel.id !== hotelId));
  };

  return (
    <div className="flex bg-gray-50 lg:mx-16">
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Khách sạn yêu thích</h1>
          <div className="text-lg font-semibold whitespace-nowrap text-blue-600">
            Bạn có {favoriteHotels.length} khách sạn trong danh sách yêu thích!
          </div>
        </div>

        {favoriteHotels.length === 0 ? (
          <div className="py-16 text-center">
            <Heart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h2 className="mb-2 text-xl font-semibold text-gray-600">
              Chưa có khách sạn yêu thích
            </h2>
            <p className="mb-6 text-gray-500">
              Hãy thêm những khách sạn bạn thích vào danh sách để dễ dàng tìm lại
            </p>
            <Link href="/hotels">
              <Button className="bg-blue-500 hover:bg-blue-600">Khám phá khách sạn</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {favoriteHotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="relative h-48 w-48 flex-shrink-0">
                      <Image src="/Hanoi.jpg" alt={hotel.name} fill className="object-cover" />

                      {hotel.discount && (
                        <Badge className="absolute top-2 left-2 text-white">
                          -{hotel.discount}%
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 text-red-500 hover:bg-white hover:text-red-600"
                        onClick={() => removeFavorite(hotel.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                          {hotel.name}
                        </h3>
                      </div>

                      <div className="mb-2 flex items-center text-gray-600">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span className="text-sm">{hotel.location}</span>
                      </div>

                      <div className="mb-3 flex items-center">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          ({hotel.reviewCount.toLocaleString()} đánh giá)
                        </span>
                      </div>

                      <p className="mb-3 line-clamp-2 text-sm text-gray-600">{hotel.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          {hotel.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {hotel.originalPrice.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              })}
                              /đêm
                            </span>
                          )}
                          <span className="text-lg font-bold text-blue-600">
                            {hotel.price.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                            /đêm
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-500 hover:bg-red-50"
                            onClick={() => removeFavorite(hotel.id)}
                          >
                            <Heart className="mr-1 h-4 w-4 fill-current" />
                            Bỏ thích
                          </Button>
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {favoriteHotels.length > 0 && (
          <div className="mt-8 text-center">
            <Link href="/hotels">
              <Button variant="outline" className="mr-4">
                Xem thêm khách sạn
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { FilterIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Pagination } from '@/base/components/layout/pagination';
import { Button } from '@/base/components/ui/button';
import { Card, CardContent, CardTitle } from '@/base/components/ui/card';
import { Input } from '@/base/components/ui/input';
import { Select } from '@/base/components/ui/select';
import { Slider } from '@/base/components/ui/slider';

import { HotelCard, HotelCardSkeleton } from '../components/hotel-card';
import { HotelSearchBoxSmall } from '../components/hotel-search-box';
import { hotelsService } from '../services/hotels.service';
import { CancelPolicy, HotelSearchParams, cancelPolicies } from '../types';
import { HotelUtils } from '../utils/hotel.utils';

type HotelsPageProps = {
  searchParams: HotelSearchParams;
};

export function HotelsPage({ searchParams }: HotelsPageProps) {
  const router = useRouter();
  const {
    data: {
      data: hotels,
      metadata: { pagination },
    },
  } = useSuspenseQuery({
    queryKey: ['hotels', 'all', searchParams],
    queryFn: () => hotelsService.getAllHotels(searchParams),
  });

  const [name, setName] = useState(searchParams.name ?? '');
  const [minPrice, setMinPrice] = useState(searchParams.minPrice ?? HotelUtils.DEFAULT_MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice ?? HotelUtils.DEFAULT_MAX_PRICE);
  const [cancelPolicy, setCancelPolicy] = useState<CancelPolicy | undefined>(
    searchParams.cancelPolicy,
  );

  const handleApplyFilters = () => {
    const url = new URL(window.location.href);

    if (name !== '') {
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

    router.push(url.href);
  };

  return (
    <div className="flex-1">
      <HotelSearchBoxSmall />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-6">
          {/* FilterFilter */}
          <div className="w-80 flex-shrink-0">
            <Card>
              <CardContent className="flex flex-col gap-4">
                <CardTitle>Bộ lọc tìm kiếm</CardTitle>
                {/* Search */}
                <div>
                  <div className="relative">
                    <SearchIcon className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm khách sạn"
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                {/* Price Range */}
                <div className="space-y-3">
                  <h3 className="font-medium">Giá</h3>
                  <Slider
                    value={[minPrice, maxPrice]}
                    step={50000}
                    max={HotelUtils.DEFAULT_MAX_PRICE}
                    onValueChange={(value) => {
                      setMinPrice(value[0]);
                      setMaxPrice(value[1]);
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span>TỐI THIỂU</span>
                    <span>TỐI ĐA</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={minPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                      className="text-center"
                      readOnly
                    />
                    <span className="self-center">-</span>
                    <Input
                      value={maxPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                      className="text-center"
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 font-medium">
                  <h3>Chính sách hủy phòng</h3>
                  <Select
                    multiple={false}
                    options={Object.entries(cancelPolicies).map(([value, label]) => ({
                      value,
                      label,
                    }))}
                    placeholder="Chọn chính sách hủy phòng..."
                    searchable={false}
                    clearable
                    value={cancelPolicy}
                    onChange={(value) => setCancelPolicy(value as CancelPolicy)}
                  />
                </div>
                <Button onClick={() => handleApplyFilters()}>
                  <FilterIcon />
                  Áp dụng
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ListList */}
          <div className="flex-1">
            {/* Sort */}
            {/* <div className="mb-6">
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
            </div> */}
            {hotels.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center">
                <Image src="/result-not-found.svg" alt="not found" width={200} height={200} />
                <p>
                  Không tìm thấy khách sạn nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử
                  lại với các tiêu chí khác.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
                <Pagination pagination={pagination} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HotelsPageSkeleton() {
  return (
    <div className="flex-1">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* FilterFilter */}
          <div className="w-80 flex-shrink-0">
            <Card>
              <CardContent>
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <SearchIcon className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Tìm kiếm khách sạn" className="pl-10" />
                  </div>
                </div>
                {/* Price Range */}
                <div>
                  <h3 className="mb-3 font-medium">Giá</h3>
                  <div className="space-y-3">
                    <Slider
                      value={[0, 5000000]}
                      step={50000}
                      max={5000000}
                      className="w-full"
                      disabled
                    />
                    <div className="flex justify-between text-sm">
                      <span>TỐI THIỂU</span>
                      <span>TỐI ĐA</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={(0).toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                        className="text-center"
                        readOnly
                      />
                      <span className="self-center">-</span>
                      <Input
                        value={(5000000).toLocaleString('vi-VN', {
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
                {/* <div className="flex gap-2">
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
                </div> */}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <HotelCardSkeleton />
              <HotelCardSkeleton />
              <HotelCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

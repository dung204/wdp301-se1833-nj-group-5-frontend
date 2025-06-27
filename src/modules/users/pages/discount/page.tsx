'use client';

import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { useQuery } from '@tanstack/react-query';
import { Clock, Filter, Gift, Hotel, PartyPopper, Sparkles, Tag, Users } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/base/components/ui/badge';
import { Button } from '@/base/components/ui/button';
import { Card, CardContent } from '@/base/components/ui/card';
import { Checkbox } from '@/base/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider } from '@/base/components/ui/tooltip';
import { discountService } from '@/modules/manager/services/discount.service';

export function Discount() {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const { data: discountData } = useQuery({
    queryKey: ['discounts', page, pageSize],
    queryFn: () =>
      discountService.getAllDiscount({
        page,
        pageSize,
      }),
  });

  const howToUseSteps = [
    {
      step: 1,
      title: 'Tìm và lựa chọn phiếu giảm giá',
      description: 'Duyệt qua các ưu đãi và chọn phiếu giảm giá phù hợp với nhu cầu của bạn',
      icon: <Tag className="h-6 w-6" />,
    },
    {
      step: 2,
      title: 'Thêm phiếu vào giỏ hàng',
      description: "Nhấn vào nút 'Nhận phiếu' để thêm mã giảm giá vào tài khoản của bạn",
      icon: <Gift className="h-6 w-6" />,
    },
    {
      step: 3,
      title: 'Áp dụng khi thanh toán',
      description: 'Khi đặt phòng, chọn phiếu giảm giá từ danh sách để được giảm giá ngay lập tức',
      icon: <Sparkles className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 h-24 w-24 animate-pulse rounded-full bg-white/10"></div>
          <div className="absolute top-20 right-20 h-16 w-16 animate-bounce rounded-full bg-yellow-400/20"></div>
          <div className="absolute bottom-20 left-20 h-20 w-20 animate-pulse rounded-full bg-pink-400/20"></div>
          <div className="absolute top-1/2 right-1/4 h-12 w-12 animate-bounce rounded-full bg-blue-400/20 delay-300"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <PartyPopper className="h-5 w-5" />
              <span className="text-sm font-medium">Ưu đãi đặc biệt</span>
            </div>
            <h1 className="mb-6 text-4xl leading-tight font-bold md:text-6xl">
              Ưu đãi ngập tràn
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Hàng ngàn deal khủng
              </span>
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-white/90 md:text-2xl">
              Tiết kiệm đến <strong className="text-yellow-300">50%</strong> cho chuyến du lịch của
              bạn
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge
                variant="secondary"
                className="border-white/30 bg-white/20 px-4 py-2 text-white"
              >
                <Gift className="mr-2 h-4 w-4" />
                156 ưu đãi khách sạn
              </Badge>
              <Badge
                variant="secondary"
                className="border-white/30 bg-white/20 px-4 py-2 text-white"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                89 deal chuyến bay
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-12 py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="sticky top-4 rounded-xl border bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Filter className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Lọc phiếu ưu đãi</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 font-medium text-gray-900">Loại ưu đãi</h3>
                  <div className="space-y-3">
                    {[
                      {
                        id: 'hotel',
                        label: 'Khách sạn',
                        count: 156,
                        color: 'bg-blue-100 text-blue-800',
                      },
                      {
                        id: 'flight',
                        label: 'Chuyến bay',
                        count: 89,
                        color: 'bg-green-100 text-green-800',
                      },
                      {
                        id: 'combo',
                        label: 'Combo tiết kiệm',
                        count: 45,
                        color: 'bg-purple-100 text-purple-800',
                      },
                      {
                        id: 'activity',
                        label: 'Hoạt động',
                        count: 78,
                        color: 'bg-orange-100 text-orange-800',
                      },
                    ].map((filter) => (
                      <div
                        key={filter.id}
                        className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox id={filter.id} />
                          <label
                            htmlFor={filter.id}
                            className="cursor-pointer text-sm font-medium text-gray-700"
                          >
                            {filter.label}
                          </label>
                        </div>
                        <Badge className={`${filter.color} text-xs`}>{filter.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-medium text-gray-900">Mức giảm giá</h3>
                  <div className="space-y-3">
                    {[
                      { range: 'Dưới 5%', color: 'bg-gray-100 text-gray-800' },
                      { range: '5% - 10%', color: 'bg-yellow-100 text-yellow-800' },
                      { range: '10% - 20%', color: 'bg-orange-100 text-orange-800' },
                      { range: 'Trên 20%', color: 'bg-red-100 text-red-800' },
                    ].map((item) => (
                      <div
                        key={item.range}
                        className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox id={item.range} />
                          <label
                            htmlFor={item.range}
                            className="cursor-pointer text-sm font-medium text-gray-700"
                          >
                            {item.range}
                          </label>
                        </div>
                        <Badge className={`${item.color} text-xs`}>Hot</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Ưu đãi nổi bật</h2>
              <p className="text-gray-600">Khám phá các deal tốt nhất dành cho bạn</p>
            </div>

            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {discountData?.data.map((promo) => (
                <Card
                  key={promo.id}
                  className="group overflow-hidden border-0 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-[15px] font-bold text-white">
                        -{promo.amount}%
                      </Badge>
                    </div>
                    <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                      <div className="absolute bg-black/10"></div>
                      <div className="absolute right-4 bottom-4">
                        <Gift className="h-8 w-8 text-white/80" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={promo.state === 'ACTIVE' ? 'default' : 'secondary'}
                          className={
                            promo.state === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {promo.state === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động'}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          Hạn:
                          <Clock className="h-4 w-4" />
                          {new Date(promo.expiredTimestamp).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>Đã sử dụng: {promo.usageCount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Tag className="h-4 w-4" />
                          <span>Tối đa: {promo.maxQualityPerUser}/người</span>
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <Hotel className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Khách sạn áp dụng:
                          </span>
                        </div>

                        <div className="max-h-[60px] min-h-[70px] cursor-pointer overflow-y-auto">
                          {promo.applicableHotels && promo.applicableHotels.length > 0 ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex flex-wrap gap-1">
                                    {promo.applicableHotels.slice(0, 2).map((hotel) => (
                                      <Badge key={hotel.id} variant="outline" className="text-xs">
                                        {hotel.name}
                                      </Badge>
                                    ))}
                                    {promo.applicableHotels.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{promo.applicableHotels.length - 2} khác
                                      </Badge>
                                    )}
                                  </div>
                                </TooltipTrigger>

                                <TooltipContent className="max-w-xs text-left">
                                  <ul className="text-xs leading-relaxed">
                                    {promo.applicableHotels.map((hotel) => (
                                      <li key={hotel.id}>• {hotel.name}</li>
                                    ))}
                                  </ul>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <p className="text-muted-foreground text-sm italic">
                              Chưa có khách sạn nào áp dụng mã giảm giá này
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      {new Date(promo.expiredTimestamp) < new Date() ? (
                        <Button
                          disabled
                          className="w-full cursor-not-allowed bg-gray-200 text-gray-500"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Đã hết hạn
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-white transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
                          // onClick={() => handleClickDiscount(promo)}
                        >
                          <Gift className="mr-2 h-4 w-4" />
                          Lấy mã ngay
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {discountData && (
              <div className="mb-12 flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
                <span className="text-sm text-gray-600">
                  Trang {discountData.metadata.pagination.currentPage} /{' '}
                  {discountData.metadata.pagination.totalPage}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!discountData.metadata.pagination.hasPreviousPage}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Trang trước
                  </Button>
                  {Array.from(
                    { length: discountData.metadata.pagination.totalPage },
                    (_, i) => i + 1,
                  ).map((num) => (
                    <Button
                      key={num}
                      variant={
                        num === discountData.metadata.pagination.currentPage ? 'success' : 'outline'
                      }
                      size="sm"
                      onClick={() => setPage(num)}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!discountData.metadata.pagination.hasNextPage}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Trang sau
                  </Button>
                </div>
              </div>
            )}
            {/* Pagination */}

            {/* How to Use Section */}
            <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-purple-50 p-8">
              <div className="mb-10 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                  Cách Áp Dụng Phiếu Giảm Giá
                </h2>
                <p className="text-lg text-gray-600">Chỉ với 3 bước đơn giản để nhận ưu đãi</p>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {howToUseSteps.map((step, index) => (
                  <div key={step.step} className="group relative text-center">
                    {index < howToUseSteps.length - 1 && (
                      <div className="absolute top-8 left-full z-0 hidden h-0.5 w-full -translate-x-1/2 transform bg-gradient-to-r from-blue-300 to-purple-300 md:block"></div>
                    )}

                    <div className="relative z-10">
                      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                        {step.icon}
                      </div>
                      <div className="rounded-xl bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
                        <h3 className="mb-3 text-lg font-semibold text-gray-900">{step.title}</h3>
                        <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

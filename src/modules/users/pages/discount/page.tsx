'use client';

import { Filter, Gift, PartyPopper, Sparkles } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/base/components/ui/badge';
import { Button } from '@/base/components/ui/button';
import { Card, CardContent } from '@/base/components/ui/card';
import { Checkbox } from '@/base/components/ui/checkbox';

export function Discount() {
  const promotions = [
    {
      id: 1,
      title: 'Giảm tới 5% cho các khách sạn',
      description: 'Áp dụng cho tất cả các khách sạn trong hệ thống. Hạn sử dụng đến 31/12/2025',
      discount: 'UP TO 5%',
      color: 'bg-blue-500',
      category: 'hotel',
      image: '/upto5_mspa.jpg',
      buttonText: 'NHẬN PHIẾU GIẢM GIÁ',
    },
    {
      id: 2,
      title: 'Giảm tới 8% cho khách sạn cao cấp',
      description: 'Chỉ áp dụng cho các khách sạn 4-5 sao. Booking tối thiểu 2 đêm',
      discount: 'UP TO 8%',
      color: 'bg-green-500',
      category: 'hotel',
      image: '/upto8_mspa.jpg',
      buttonText: 'NHẬN PHIẾU GIẢM GIÁ',
    },
    {
      id: 3,
      title: 'Giảm giá trong thời gian giới hạn',
      description: 'Ưu đãi đặc biệt chỉ có trong ngày hôm nay. Số lượng có hạn',
      discount: '15%',
      color: 'bg-red-500',
      category: 'flash',
      image: '/upto5_mspa.jpg',
      buttonText: 'SỬ DỤNG NGAY',
    },
    {
      id: 4,
      title: 'Ưu đãi xanh thân thiện môi trường',
      description: 'Dành cho các khách sạn có chứng nhận xanh và thân thiện môi trường',
      discount: 'ECO DEALS',
      color: 'bg-green-600',
      category: 'eco',
      image: '/upto5_mspa.jpg',
      buttonText: 'XEM THÊM',
    },
    {
      id: 5,
      title: 'Chương trình Agoda VIP',
      description: 'Ưu đãi độc quyền dành cho thành viên VIP với nhiều đặc quyền',
      discount: 'VIP',
      color: 'bg-purple-600',
      category: 'vip',
      image: '/upto5_mspa.jpg',
      buttonText: 'THAM GIA NGAY',
    },
    {
      id: 6,
      title: 'Ưu đãi du lịch nội địa',
      description: 'Giảm giá đặc biệt cho các chuyến du lịch trong nước',
      discount: 'DOMESTIC DEALS',
      color: 'bg-orange-500',
      category: 'domestic',
      image: '/upto5_mspa.jpg',
      buttonText: 'XEM NGAY',
    },
    {
      id: 7,
      title: 'Ưu đãi quốc tế - Giảm đến 30%',
      description: 'Ưu đãi lớn cho các chuyến du lịch quốc tế. Booking sớm để có giá tốt nhất',
      discount: 'INTERNATIONAL DEALS',
      color: 'bg-blue-600',
      category: 'international',
      image: '/upto5_mspa.jpg',
      buttonText: 'XEM THÊM',
    },
    {
      id: 8,
      title: 'Tiết kiệm với gói du lịch Agoda',
      description: 'Đặt combo khách sạn + vé máy bay để tiết kiệm tối đa chi phí',
      discount: 'COMBO',
      color: 'bg-yellow-500',
      image: '/upto5_mspa.jpg',
      category: 'combo',
      buttonText: 'Chọn gói ưu đãi',
    },
  ];

  const howToUseSteps = [
    {
      step: 1,
      title: 'Tìm và lựa chọn phiếu giảm giá',
      description: 'Duyệt qua các ưu đãi và chọn phiếu giảm giá phù hợp với nhu cầu của bạn',
    },
    {
      step: 2,
      title: 'Thêm phiếu vào giỏ hàng',
      description: "Nhấn vào nút 'Nhận phiếu' để thêm mã giảm giá vào tài khoản của bạn",
    },
    {
      step: 3,
      title: 'Áp dụng khi thanh toán',
      description: 'Khi đặt phòng, chọn phiếu giảm giá từ danh sách để được giảm giá ngay lập tức',
    },
  ];

  return (
    <div className="">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500">
        <div className="absolute inset-0">
          <div className="absolute top-4 left-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-400">
              <div className="h-4 w-4 rounded-full bg-white"></div>
              <div className="ml-1 h-3 w-3 rounded-full bg-white"></div>
              <div className="ml-2 h-2 w-2 rounded-full bg-white"></div>
            </div>
          </div>

          <div className="absolute top-8 right-20">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400">
              <Gift className="h-8 w-8 animate-ping text-white" />
            </div>
          </div>
          <div className="absolute top-30 right-40">
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-purple-500">
              <PartyPopper className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="absolute bottom-4 left-40 animate-pulse">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-400">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center text-white">
            <h1 className="animate-bounce text-3xl font-bold text-white">
              Ưu đãi ngập tràn - Hàng ngàn deal khủng
              <span className="relative ml-2 inline-block">
                <span className="absolute top-0 -left-1 inline-block h-4 w-4 animate-ping rounded-full bg-white opacity-75"></span>
                <span className="relative text-4xl font-bold text-white">!</span>
              </span>
            </h1>
            <p className="animate-pulse text-xl text-white">
              <strong>Khuyến mãi độc quyền chỉ có ở travelbooking.com - </strong>
              Hãy tận dụng ngay hôm nay để nhận ưu đãi tốt nhất!
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="sticky top-4 rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Lọc phiếu ưu đãi</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 font-medium">Loại ưu đãi</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'hotel', label: 'Khách sạn', count: 156 },
                      { id: 'flight', label: 'Chuyến bay', count: 89 },
                      { id: 'combo', label: 'Combo tiết kiệm', count: 45 },
                      { id: 'activity', label: 'Hoạt động', count: 78 },
                    ].map((filter) => (
                      <div key={filter.id} className="flex items-center space-x-2">
                        <Checkbox id={filter.id} />
                        <label htmlFor={filter.id} className="flex-1 cursor-pointer text-sm">
                          {filter.label} ({filter.count})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-medium">Mức giảm giá</h3>
                  <div className="space-y-2">
                    {['Dưới 5%', '5% - 10%', '10% - 20%', 'Trên 20%'].map((range) => (
                      <div key={range} className="flex items-center space-x-2">
                        <Checkbox id={range} />
                        <label htmlFor={range} className="cursor-pointer text-sm">
                          {range}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {promotions.map((promo) => (
                <Card
                  key={promo.id}
                  className="flex overflow-hidden p-0 transition-shadow hover:shadow-lg"
                >
                  <CardContent className="flex flex-col p-0">
                    <div className="relative overflow-hidden text-white">
                      <Image
                        src={promo?.image}
                        alt={promo.title}
                        width={400}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                      <div className="mb-2 text-2xl font-bold">{promo.discount}</div>
                      {promo.category === 'flash' ? (
                        <Badge
                          variant="secondary"
                          className="border-white/30 bg-white/20 text-white"
                        >
                          Thời gian có hạn
                        </Badge>
                      ) : (
                        <div className="h-6"></div>
                      )}
                    </div>
                    <div className="mt-auto p-4">
                      <h3 className="mb-2 overflow-hidden font-semibold text-ellipsis whitespace-nowrap">
                        {promo.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm text-gray-600">{promo.description}</p>
                      <Button
                        className={`w-full ${promo.color} py-6 text-white hover:opacity-90`}
                        size="sm"
                      >
                        {promo.buttonText}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* How to Use Section */}
            <section className="rounded-lg bg-gray-50 p-8">
              <h2 className="mb-8 text-center text-2xl font-bold">Cách Áp Dụng Phiếu Giảm Giá</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {howToUseSteps.map((step) => (
                  <div key={step.step} className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white">
                      {step.step}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
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

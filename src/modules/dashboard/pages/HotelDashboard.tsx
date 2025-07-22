'use client';

import { useQuery } from '@tanstack/react-query';
import { CalendarDays, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/base/components/ui/card';
import { Select } from '@/base/components/ui/select';
import { Skeleton } from '@/base/components/ui/skeleton';
import { hotelsService } from '@/modules/hotels';
import { roomsService } from '@/modules/rooms';

import { hotelDashboardService } from '../services/hoteldashboard.service';

export const HotelDashboard = () => {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(String(today.getDate()));
  const [selectedMonth, setSelectedMonth] = useState(String(today.getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedHotelIds, setSelectedHotelIds] = useState<string[]>([]);
  const isHotelSelected = (hotelId: string) =>
    selectedHotelIds.length == 0 || selectedHotelIds.includes(hotelId);

  const { data: hotels, isLoading: loadingHotels } = useQuery({
    queryKey: ['hotels', 'admin', 'all'],
    queryFn: () => hotelsService.getHotelByAdmin(),
  });
  const hotelOptions = (hotels?.data ?? []).map((hotel) => ({
    label: hotel.name,
    value: hotel.id,
  }));
  const { data: rooms, isLoading: loadingRooms } = useQuery({
    queryKey: ['rooms', 'all'],
    queryFn: () => roomsService.getRoomsByAdmin(),
  });

  const { data: bookingSourceData, isLoading: loadingBooking } = useQuery({
    queryKey: ['bookingSource'],
    queryFn: () => hotelDashboardService.getCalculateAllBooking(),
  });

  const { data: dailyRevenueData, isLoading: loadingDaily } = useQuery({
    queryKey: ['dailyRevenue'],
    queryFn: () => hotelDashboardService.getRevenueByDate(),
  });

  const { data: monthlyRevenueData, isLoading: loadingMonthly } = useQuery({
    queryKey: ['monthlyRevenue', selectedYear],
    queryFn: () => hotelDashboardService.getRevenueMonthly(selectedYear),
  });

  const { data: yearlyRevenueData, isLoading: loadingYearly } = useQuery({
    queryKey: ['yearlyRevenue', selectedYear],
    queryFn: () => hotelDashboardService.getRevenueYearly(selectedYear),
  });

  const isLoading = loadingDaily || loadingMonthly || loadingYearly || loadingBooking;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
      </div>
    );
  }

  // Tính tổng doanh thu theo ngày cho tất cả khách sạn
  const totalRevenueByDate: Record<string, number> = {};
  const revenueByHotel: Record<string, number> = {};

  dailyRevenueData?.data.forEach((item) => {
    const { date, totalRevenue, hotel } = item;
    totalRevenueByDate[date] = (totalRevenueByDate[date] || 0) + totalRevenue;

    const hotelName = hotel.name;
    revenueByHotel[hotelName] = (revenueByHotel[hotelName] || 0) + totalRevenue;
  });

  const totalRevenueData = Object.entries(totalRevenueByDate)
    .map(([date, totalRevenue]) => ({
      date,
      totalRevenue,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const revenueTableByDate: Record<string, Record<string, number>> = {};
  const filteredDailyRevenue = dailyRevenueData?.data.filter((item) =>
    isHotelSelected(item.hotel.id),
  );

  // Tính tổng doanh thu theo khách sạn (có lọc)
  const filteredRevenueByHotel: Record<string, number> = {};
  filteredDailyRevenue?.forEach(({ hotel, totalRevenue }) => {
    const hotelName = hotel.name;
    filteredRevenueByHotel[hotelName] = (filteredRevenueByHotel[hotelName] || 0) + totalRevenue;
  });

  // Dữ liệu cho biểu đồ cột
  const revenueChartData = Object.entries(filteredRevenueByHotel).map(([hotel, revenue]) => ({
    hotel,
    revenue,
  }));
  // 🛠️ Gán dữ liệu cho revenueTableByDate từ filteredDailyRevenue
  filteredDailyRevenue?.forEach(({ date, hotel, totalRevenue }) => {
    const hotelName = hotel.name;
    if (!revenueTableByDate[date]) {
      revenueTableByDate[date] = {};
    }
    if (!revenueTableByDate[date][hotelName]) {
      revenueTableByDate[date][hotelName] = 0;
    }
    revenueTableByDate[date][hotelName] += totalRevenue;
  });

  const allDates = Object.keys(revenueTableByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );
  const allHotelsSet = new Set<string>();
  filteredDailyRevenue?.forEach((item) => {
    allHotelsSet.add(item.hotel.name);
  });
  const allHotels = Array.from(allHotelsSet);

  // Tính tổng doanh thu theo tháng cho tất cả khách sạn
  const monthlyRevenue = monthlyRevenueData?.data || [];
  const filteredMonthlyRevenue = monthlyRevenue.filter(
    ({ hotel }) => !selectedHotelIds.length || selectedHotelIds.includes(hotel?._id),
  );
  const totalMonthlyRevenue = Array.from(
    monthlyRevenue.reduce((acc, { month, totalRevenue }) => {
      acc.set(month, (acc.get(month) || 0) + totalRevenue);
      return acc;
    }, new Map<number, number>()),
  )
    .sort((a, b) => a[0] - b[0])
    .map(([month, totalRevenue]) => ({
      month: `Tháng ${month}`,
      totalRevenue,
    }));

  const revenueTableByMonth: Record<number, Record<string, number>> = {};
  const hotelSetMonthly = new Set<string>();
  filteredMonthlyRevenue.forEach(({ month, totalRevenue, hotel }) => {
    const hotelName = hotel?.name || 'Không rõ';
    hotelSetMonthly.add(hotelName);

    if (!revenueTableByMonth[month]) {
      revenueTableByMonth[month] = {};
    }
    if (!revenueTableByMonth[month][hotelName]) {
      revenueTableByMonth[month][hotelName] = 0;
    }

    revenueTableByMonth[month][hotelName] += totalRevenue;
  });

  const allHotelsMonthly = Array.from(hotelSetMonthly);

  // Tính tổng doanh thu theo năm cho tất cả khách sạn
  const yearlyRevenue = yearlyRevenueData?.data || [];
  const filteredYearlyRevenue = yearlyRevenue.filter(
    ({ hotel }) => !selectedHotelIds.length || selectedHotelIds.includes(hotel?._id),
  );
  const totalYearlyRevenue = Array.from(
    yearlyRevenue.reduce((acc, { year, totalRevenue }) => {
      const y = `Năm ${year}`;
      acc.set(y, (acc.get(y) || 0) + totalRevenue);
      return acc;
    }, new Map()),
  ).map(([year, totalRevenue]) => ({ year, totalRevenue }));
  const revenueTableByYear: Record<
    number,
    Record<string, { revenue: number; bookings: number }>
  > = {};
  const hotelSetYearly = new Set<string>();

  filteredYearlyRevenue.forEach(({ year, totalRevenue, totalBookings, hotel }) => {
    const hotelName = hotel?.name || 'Không rõ';
    hotelSetYearly.add(hotelName);

    if (!revenueTableByYear[year]) {
      revenueTableByYear[year] = {};
    }
    if (!revenueTableByYear[year][hotelName]) {
      revenueTableByYear[year][hotelName] = { revenue: 0, bookings: 0 };
    }

    revenueTableByYear[year][hotelName].revenue += totalRevenue;
    revenueTableByYear[year][hotelName].bookings += totalBookings;
  });

  const allHotelsYearly = Array.from(hotelSetYearly);
  const allYears = Object.keys(revenueTableByYear)
    .map(Number)
    .sort((a, b) => b - a);

  // 🔍 Lọc theo ngày + tháng nếu được chọn
  const filteredDates = allDates.filter((dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;

    const matchDay = selectedDay ? day === parseInt(selectedDay) : true;
    const matchMonth = selectedMonth ? month === parseInt(selectedMonth) : true;

    return matchDay && matchMonth;
  });

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Tổng khách sạn */}
        <Card className="rounded-2xl bg-blue-50 shadow-md hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-700">Tổng khách sạn</CardTitle>
            <span className="text-2xl text-blue-600">🏨</span>
          </CardHeader>
          <CardContent>
            {loadingHotels ? (
              <Skeleton className="h-6 w-12" />
            ) : (
              <div className="text-3xl font-bold text-blue-800">
                {hotels?.metadata?.pagination?.total ?? 0} khách sạn
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tổng số phòng */}
        <Card className="rounded-2xl bg-green-50 shadow-md hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-700">Tổng số phòng</CardTitle>
            <span className="text-2xl text-green-600">🛏️</span>
          </CardHeader>
          <CardContent>
            {loadingRooms ? (
              <Skeleton className="h-6 w-12" />
            ) : (
              <div className="text-3xl font-bold text-green-800">
                {rooms?.metadata?.pagination?.total ?? 0} phòng
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tổng booking */}
        <Card className="rounded-2xl bg-yellow-50 shadow-md hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-yellow-700">Tổng booking</CardTitle>
            <span className="text-2xl text-yellow-600">📦</span>
          </CardHeader>
          <CardContent>
            {loadingBooking ? (
              <Skeleton className="h-6 w-12" />
            ) : (
              <div className="text-3xl font-bold text-yellow-800">
                {bookingSourceData?.data.totalProcessed ?? 0} booking
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Tổng khách sạn */}
        {/* Filters */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="mb-4 flex items-center">
              <label className="w-44 text-sm font-medium text-gray-700">Lọc theo khách sạn</label>
              <div className="flex-1">
                <div className="max-h-[64px] overflow-y-auto">
                  <Select
                    multiple
                    placeholder="Chọn khách sạn"
                    options={hotelOptions ?? []}
                    value={selectedHotelIds}
                    onChange={(values) => {
                      setSelectedHotelIds(values);
                    }}
                    className="w-full"
                  />
                </div>

                {/* <AsyncSelect
              {...HotelUtils.getHotelsByAdminAsyncSelectOptions('name')}
              multiple
              onChange={(values) => {
                setSelectedHotelIds(values);
              }}
              value={selectedHotelIds}
            /> */}
              </div>
            </div>
          </div>
          <Card className="mt-2 border-0 bg-white/70 shadow-sm backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Revenue by Hotel
              </CardTitle>

              <CardDescription>Tổng doanh thu theo từng khách sạn</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={revenueChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="hotel"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      value >= 1_000_000 ? `${value / 1_000_000}M` : `${value / 1_000}k`
                    }
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      value.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })
                    }
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    className="drop-shadow-sm"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Revenue Trend */}
          <Card className="mt-5 border-0 bg-white/70 shadow-sm backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                Xu hướng doanh thu hàng ngày (gộp tất cả khách sạn)
              </CardTitle>
              <CardDescription>Tổng doanh thu của tất cả các khách sạn theo ngày</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={totalRevenueData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(dateStr) => {
                      const date = new Date(dateStr);
                      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
                        .toString()
                        .padStart(2, '0')}`;
                    }}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    tickFormatter={(value) => {
                      if (value >= 1_000_000) return `${value / 1_000_000}M`;
                      if (value >= 1_000) return `${value / 1_000}k`;
                      return value;
                    }}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      value.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })
                    }
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: 'white' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bộ lọc ngày/tháng */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-600">
                Bảng tổng doanh thu từng ngày theo khách sạn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {/* Bộ lọc ngày và tháng */}
              <div className="flex items-center gap-4">
                <div>
                  <label className="mr-2 font-medium">Chọn ngày:</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="rounded border px-2 py-1 text-sm"
                  >
                    <option value="">Tất cả</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mr-2 font-medium">Chọn tháng:</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="rounded border px-2 py-1 text-sm"
                  >
                    <option value="">Tất cả</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bảng dữ liệu */}
              <div className="overflow-auto rounded border">
                <table className="w-full min-w-max table-auto border-collapse text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Ngày</th>
                      {allHotels.map((hotel) => (
                        <th key={hotel} className="border px-4 py-2">
                          {hotel}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDates.map((date) => (
                      <tr key={date} className="hover:bg-gray-50">
                        <td className="border px-4 py-2 font-medium">
                          {new Date(date).toLocaleDateString('vi-VN')}
                        </td>
                        {allHotels.map((hotel) => (
                          <td key={hotel} className="border px-4 py-2">
                            {(revenueTableByDate[date]?.[hotel] || 0).toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Doanh thu theo tháng (BarChart) */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-600">Doanh thu theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <label className="mr-2 font-medium">Chọn năm:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="rounded border px-2 py-1 text-sm"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = today.getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            <ResponsiveContainer width="100%" height={300} className="mt-4">
              <BarChart data={totalMonthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1_000_000}M`} />
                <Tooltip
                  formatter={(value: number) =>
                    value.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })
                  }
                />
                <Legend />
                <Bar dataKey="totalRevenue" name="Tổng doanh thu" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-600">
              Tổng doanh thu từng khách sạn theo tháng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-6 space-y-2 text-sm">
              <h4 className="font-semibold">Bảng doanh thu từng tháng theo khách sạn</h4>
              <div className="overflow-auto rounded border">
                <table className="w-full min-w-max table-auto border-collapse text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Tháng</th>
                      {allHotelsMonthly.map((hotel) => (
                        <th key={hotel} className="border px-4 py-2">
                          {hotel}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <tr key={month} className="hover:bg-gray-50">
                        <td className="border px-4 py-2 font-medium">Tháng {month}</td>
                        {allHotelsMonthly.map((hotel) => (
                          <td key={hotel} className="border px-4 py-2 text-right">
                            {(revenueTableByMonth[month]?.[hotel] || 0).toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doanh thu theo năm (RadarChart) */}

        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-600">Tổng doanh thu theo năm</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={totalYearlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `${value / 1_000_000}M`} />
                <Tooltip
                  formatter={(value: number) =>
                    value.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })
                  }
                />
                <Legend />
                <Bar dataKey="totalRevenue" name="Tổng doanh thu" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-600">
              Bảng tổng doanh thu từng khách sạn theo năm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded border">
              <table className="w-full min-w-max table-auto border-collapse text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">Năm</th>
                    {allHotelsYearly.map((hotel) => (
                      <th key={hotel} className="border px-4 py-2">
                        {hotel}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allYears.map((year) => (
                    <tr key={year} className="hover:bg-gray-50">
                      <td className="border px-4 py-2 font-medium">{year}</td>
                      {allHotelsYearly.map((hotel) => (
                        <td key={hotel} className="border px-4 py-2 text-right">
                          {(revenueTableByYear[year]?.[hotel]?.revenue || 0).toLocaleString(
                            'vi-VN',
                            {
                              style: 'currency',
                              currency: 'VND',
                            },
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

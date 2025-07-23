import { HttpClient } from '@/base/lib';
import { SuccessResponse } from '@/base/types';

import { BookingSource, RevenueDaily, RevenueMonthly, RevenueYearly } from '../types';

class HotelDashboardService extends HttpClient {
  constructor() {
    super();
  }
  // GET /api/v1/revenue-report/monthly
  // GET /api/v1/revenue-report/monthly?year=2025
  async getRevenueMonthly(year: number): Promise<SuccessResponse<RevenueMonthly[]>> {
    return this.get('/revenue-report/monthly', {
      isPrivateRoute: true,
      params: { year },
    });
  }

  // GET /api/v1/revenue-report
  async getRevenueByDate(): Promise<SuccessResponse<RevenueDaily[]>> {
    return this.get('/revenue-report', { isPrivateRoute: true });
  }

  // GET /api/v1/booking-source
  async getCalculateAllBooking(): Promise<SuccessResponse<BookingSource>> {
    return this.get('/revenue-report/calculate-all', { isPrivateRoute: true });
  }

  // GET /api/v1/revenue-report/room
  async getRevenueYearly(year: number): Promise<SuccessResponse<RevenueYearly[]>> {
    return this.get('/revenue-report/yearly', {
      isPrivateRoute: true,
      params: { year },
    });
  }
}

export const hotelDashboardService = new HotelDashboardService();

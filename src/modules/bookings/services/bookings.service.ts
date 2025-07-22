import { HttpClient } from '@/base/lib';
import { SuccessResponse } from '@/base/types';

import { Booking, BookingsSearchParams, CreateBookingSchema } from '../types';

class BookingsService extends HttpClient {
  constructor() {
    super();
  }

  getAllBookings(params?: BookingsSearchParams) {
    return this.get<SuccessResponse<Booking[]>>('/bookings', {
      params,
      isPrivateRoute: true,
    });
  }

  createBooking(payload: CreateBookingSchema) {
    return this.post<SuccessResponse<Booking>>('/bookings', payload, {
      isPrivateRoute: true,
    });
  }
}

export const bookingsService = new BookingsService();

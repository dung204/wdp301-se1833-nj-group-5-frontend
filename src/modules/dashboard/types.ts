// types.ts
export interface RevenueDaily {
  id: string;
  date: string; // ISO date
  totalRevenue: number;
  totalBookings: number;
  hotel: {
    id: string;
    name: string;
  };
}

export type RevenueMonthly = {
  month: number;
  totalRevenue: number;
  hotel: {
    _id: string;
    name: string;
  };
};

export type BookingSource = {
  message: string;
  totalProcessed: number;
};

export type RevenueYearly = {
  hotel: {
    _id: string;
    name: string;
  };
  year: number;
  totalRevenue: number;
  totalBookings: number;
};

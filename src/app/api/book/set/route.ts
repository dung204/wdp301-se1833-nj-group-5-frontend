import { createBookingSchema } from '@/modules/bookings/types';

export async function POST(request: Request) {
  const booking = createBookingSchema.safeParse(await request.json());

  if (!booking.success) {
    return new Response(JSON.stringify(booking.error), {
      status: 404,
    });
  }

  return new Response(null, {
    status: 204,
    headers: {
      'Set-Cookie': `booking=${JSON.stringify(booking.data)}; Path=/; Secure; Max-Age=31536000; HttpOnly; SameSite=Lax`,
    },
  });
}

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { UserActions } from '@/base/components/layout/user-actions';
import { userSchema } from '@/modules/users';

import { BookingSteps } from './booking-steps';

export async function BookingHeader() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const user = userSchema
    .pick({
      id: true,
      fullName: true,
      role: true,
      gender: true,
    })
    .safeParse(JSON.parse(cookieStore.get('user')?.value ?? '{}')).data;

  return (
    <header className="z-50 border-b bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <nav className="flex items-center gap-4">
          <Link href="/">
            <Image src="/travel-booking-logo.png" alt="Logo" height={20} width={166} />
          </Link>
        </nav>
        <Suspense>
          <BookingSteps />
        </Suspense>
        <UserActions user={user} />
      </div>
    </header>
  );
}

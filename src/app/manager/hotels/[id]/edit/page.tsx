'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EditHotelPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the hotels management page where editing is handled via dialog
    router.replace('/manager/hotels');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to hotels management page...</p>
      </div>
    </div>
  );
}

import { PropsWithChildren } from 'react';

import { Footer } from '@/base/components/layout/footer';
import { ScrollArea } from '@/base/components/ui/scroll-area';
import { BookingHeader } from '@/modules/bookings';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen flex-col overflow-y-hidden">
      <BookingHeader />
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <main className="mx-auto max-w-7xl">{children}</main>
        <Footer />
      </ScrollArea>
    </div>
  );
}

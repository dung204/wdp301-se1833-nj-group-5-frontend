import { ScrollArea } from '@/base/components/ui/scroll-area';

import Footer from './footer/page';
import Header from './header/page';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollArea className="h-screen pt-28">
        <Header />
        <main>{children}</main>
        <Footer />
      </ScrollArea>
    </>
  );
}

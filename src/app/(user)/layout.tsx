import { Footer } from '@/base/components/layout/footer';
import { Header } from '@/base/components/layout/header';
import { ScrollArea } from '@/base/components/ui/scroll-area';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-y-hidden">
      <Header />
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <main>{children}</main>
        <Footer />
      </ScrollArea>
    </div>
  );
}

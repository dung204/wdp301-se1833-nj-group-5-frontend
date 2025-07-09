import { Footer } from '@/base/components/layout/footer';
import { Header } from '@/base/components/layout/header';
import { ScrollArea } from '@/base/components/ui/scroll-area';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-y-hidden">
      <Header />
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <main className="flex h-[calc(100vh-5rem)] flex-col">
          {children}
          <Footer />
        </main>
      </ScrollArea>
    </div>
  );
}

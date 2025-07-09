import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

import { Toaster } from '@/base/components/ui/toaster';
import { QueryProvider } from '@/base/providers';
import '@/base/styles/globals.css';
import { ConfirmLogoutDialogProvider } from '@/modules/auth';

export const metadata: Metadata = {
  title: {
    template: '%s | travelbooking.com',
    default: 'travelbooking.com',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider>
          <QueryProvider>
            <ConfirmLogoutDialogProvider>{children}</ConfirmLogoutDialogProvider>
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    // Allow images from all domains (suitable for development and user-generated content)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // For production, consider using specific domains instead:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'hatrabbits.com',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'example.com',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'cdn.example.com',
    //   },
    // ],
    unoptimized: false,
  },
};

const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/base/i18n/request.ts',
  experimental: {
    createMessagesDeclaration: ['./messages/en.json', './messages/vi.json'],
  },
});
export default withNextIntl(nextConfig);

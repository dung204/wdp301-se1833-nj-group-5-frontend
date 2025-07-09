import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['example.com', 'shac.vn'], // 👈 Thêm domain này vào đây
    remotePatterns: [
      {
        hostname: 'localhost',
        port: '9000',
        pathname: '/wdp301-se1833-nj-group-5-bucket/**',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/base/i18n/request.ts',
  experimental: {
    createMessagesDeclaration: ['./messages/en.json', './messages/vi.json'],
  },
});
export default withNextIntl(nextConfig);

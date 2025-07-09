import { Metadata } from 'next';

import { RegisterPage } from '@/modules/auth';

export const metadata: Metadata = {
  title: 'Đăng ký',
};

export default function Page() {
  return <RegisterPage />;
}

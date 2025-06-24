'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/base/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/base/components/ui/card';

import { RegisterForm } from '../components/register-form';

export function RegisterPage() {
  return (
    <div className="flex grow items-center justify-center">
      <Card className="m-auto w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">Đăng ký</CardTitle>
          <CardDescription className="text-center">
            Đăng ký để trải nghiệm dịch vụ của chúng tôi
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <RegisterForm />
          <div className="flex items-center gap-2">
            <div className="border-border w-full border"></div>
            <p className="font-medium">Hoặc</p>
            <div className="border-border w-full border"></div>
          </div>
          <Button variant="outline" className="w-full">
            <Image src="/google-logo.svg" alt="Google logo" width={18} height={18} />
            Tiếp tục với Google
          </Button>
          <div className="text-center">
            Bạn đã có tài khoản?{' '}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

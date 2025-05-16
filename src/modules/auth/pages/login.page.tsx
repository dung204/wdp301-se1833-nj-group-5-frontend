'use client';

import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/base/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/base/components/ui/card';

import { LoginForm } from '../components/login-form';

export function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <Link href="/">
                <Button variant="link" className="w-max">
                  <ArrowLeftIcon />
                  Back to home page
                </Button>
              </Link>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Enter your email below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm onLoginSuccess={() => router.replace('/private')} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

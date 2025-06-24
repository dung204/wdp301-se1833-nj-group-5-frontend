'use client';

import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError, HttpStatusCode } from 'axios';
import { AlertCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Alert, AlertDescription, AlertTitle } from '@/base/components/ui/alert';
import { Form } from '@/base/components/ui/form';
import { LoginSchema, loginSchema } from '@/modules/auth/types';

import { authService } from '../services/auth.service';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const router = useRouter();

  const {
    mutate: triggerLogin,
    isPending,
    error,
  } = useMutation({
    mutationFn: (payload: LoginSchema) => authService.login(payload),
    onSuccess: async ({ data }) => {
      await axios.post('/api/auth/set-cookie', {
        data: {
          ...data,
          user: {
            ...data.user,
            fullName: data.user.fullName && encodeURIComponent(data.user.fullName),
          },
        },
      });
      router.replace('/');
      onLoginSuccess?.();
    },
  });

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="danger" className="bg-danger/10">
          <AlertCircleIcon />
          <AlertTitle>Không thể đăng nhập</AlertTitle>
          <AlertDescription>
            {error instanceof AxiosError && error.status === HttpStatusCode.Unauthorized
              ? 'Email hoặc mật khẩu không chính xác.'
              : 'Đã xảy ra lỗi bất ngờ khi đăng ký. Vui lòng thử lại sau.'}
          </AlertDescription>
        </Alert>
      )}
      <Form
        className="flex flex-col gap-4"
        loading={isPending}
        schema={loginSchema}
        fields={[
          {
            name: 'email',
            type: 'text',
            label: 'Email',
            placeholder: '',
            disabled: isPending,
          },
          {
            name: 'password',
            type: 'password',
            label: 'Mật khẩu',
            placeholder: '',
            disabled: isPending,
          },
        ]}
        renderSubmitButton={(Button) => <Button>Đăng nhập</Button>}
        onSuccessSubmit={(data) => triggerLogin(data)}
      />
    </div>
  );
}

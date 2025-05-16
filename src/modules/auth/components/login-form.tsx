'use client';

import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { InfoIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Alert, AlertDescription, AlertTitle } from '@/base/components/ui/alert';
import { Form } from '@/base/components/ui/form';
import { LoginSchema, loginSchema } from '@/modules/auth/types';

import { authService } from '../services/auth.service';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const {
    mutateAsync: triggerLogin,
    isPending,
    error,
  } = useMutation({
    mutationFn: (payload: LoginSchema) => authService.login(payload),
    onSuccess: async ({ data }) => {
      await axios.post('/api/auth/set-cookie', { data });
      onLoginSuccess?.();
    },
  });

  const i18nNamespace = 'modules.auth.components.LoginForm';
  const t = useTranslations(i18nNamespace);

  return (
    <div className="space-y-6">
      {error instanceof AxiosError && (
        <Alert variant="danger">
          <InfoIcon className="size-4" />
          <AlertTitle>Login failed</AlertTitle>
          <AlertDescription>
            {t(`errors.${error.status}` as Parameters<typeof t>[0])}
          </AlertDescription>
        </Alert>
      )}
      <Form
        className="flex flex-col gap-6"
        i18nNamespace={i18nNamespace}
        schema={loginSchema}
        fields={[
          {
            name: 'email',
            type: 'text',
            disabled: isPending,
          },
          {
            name: 'password',
            type: 'password',
            disabled: isPending,
          },
        ]}
        renderSubmitButton={(Button) => <Button>Login</Button>}
        onSuccessSubmit={(data) => triggerLogin(data)}
      />
    </div>
  );
}

'use client';

import { Eye, EyeOff } from 'lucide-react';
import { ComponentProps, useState } from 'react';

import { Button } from '@/base/components/ui/button';
import { Input } from '@/base/components/ui/input';
import { cn } from '@/base/lib';

interface PasswordInputProps extends Omit<ComponentProps<typeof Input>, 'type'> {
  defaultShowPassword?: boolean;
}

export function PasswordInput({
  className,
  defaultShowPassword,
  disabled,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(!!defaultShowPassword);

  const Icon = showPassword ? EyeOff : Eye;

  return (
    <div
      className={cn(
        'border-input flex rounded-md border transition-all',
        'has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-ring/50 has-[input:focus-visible]:ring-[3px]',
        'has-[input[aria-invalid="true"]]:ring-danger/20 dark:has-[input[aria-invalid="true"]]:ring-danger/40 has-[input[aria-invalid="true"]]:border-danger',
        className,
      )}
    >
      <Input
        type={showPassword ? 'text' : 'password'}
        className="rounded-none border-0 focus-visible:ring-0"
        disabled={disabled}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        disabled={disabled}
        onClick={() => setShowPassword(!showPassword)}
      >
        <Icon className="size-4" />
      </Button>
    </div>
  );
}

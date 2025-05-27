'use client';

import { ThemeToggle } from '@/base/components/ui/theme-toggle';

interface AppHeaderProps {
  title: string;
  description?: string;
  showThemeToggle?: boolean;
  className?: string;
}

export function AppHeader({
  title,
  description,
  showThemeToggle = true,
  className = '',
}: AppHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mx-auto max-w-2xl">{description}</p>}
      </div>
      {showThemeToggle && (
        <div>
          <ThemeToggle />
        </div>
      )}
    </div>
  );
}

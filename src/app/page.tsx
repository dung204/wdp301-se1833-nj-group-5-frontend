import Link from 'next/link';

import { Button } from '@/base/components/ui/button';

export default function Home() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-4">
      <p>Hey there, please login to continue</p>
      <Link href="/auth/login">
        <Button>Go to Login</Button>
      </Link>
    </div>
  );
}

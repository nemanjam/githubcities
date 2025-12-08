'use client';

import Link from 'next/link';

import { RefreshCcw, Settings } from 'lucide-react';

import { Button } from '@workspace/ui/components/ui/button';

import { ROUTES } from '@/constants/routes';

import type { FC } from 'react';

import '@workspace/ui/global.css';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

const { HOME } = ROUTES;

// Todo: improve design

// Note: global-error.tsx, global-not-found.tsx define own html and body tags, and need to import global.css from UI package

const GlobalError: FC<Props> = ({ error, reset }) => (
  <html>
    <body className="relative min-h-screen min-w-80 flex flex-col bg-background font-sans antialiased">
      <main className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <div className="flex justify-center">
            <Settings className="size-24 text-muted-foreground" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight">500 - Server Error</h1>
          <p className="text-muted-foreground">
            We are sorry, but something went wrong on our end. Please try again later.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => reset()} variant="outline">
              <RefreshCcw className="mr-2 size-4" /> Try Again
            </Button>
            <Button asChild>
              <Link href={HOME}>Return to Home</Link>
            </Button>
          </div>

          {error.digest && (
            <p className="text-sm text-muted-foreground">Error ID: {error.digest}</p>
          )}
        </div>
      </main>
    </body>
  </html>
);

export default GlobalError;

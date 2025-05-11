'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { UserNavbar } from '@/components/UserNavbar';
import { UserFooter } from '@/components/UserFooter';

export function UserLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  if (isAdminPage || isLoginPage) {
    // For admin and login pages, their respective layouts (AdminLayout, LoginPage)
    // provide the full structure including filling the screen.
    // We just render the children directly.
    return <>{children}</>;
  }

  // For user-facing pages, wrap with UserNavbar, main content area, and UserFooter.
  // The `div className="flex-grow"` ensures that the main content area takes up available space,
  // pushing the footer down. This is consistent with the body's flex-col layout.
  return (
    <>
      <UserNavbar />
      <div className="flex-grow"> {/* This div ensures the content area expands */}
        <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
      <UserFooter />
    </>
  );
}

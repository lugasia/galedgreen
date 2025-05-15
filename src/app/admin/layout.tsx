"use client";

import React, { type ReactNode, useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button'; // For potential header elements
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext'; // Assuming an AuthContext for admin protection
// import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // const { isAdmin, loading } = useAuth(); // Replace with your actual auth check
  // const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Basic auth simulation - replace with actual auth logic
    // if (!loading && !isAdmin && pathname !== '/login') {
    //   router.replace('/login');
    // }
  }, [pathname /*, isAdmin, loading, router*/]);

  // if (loading || !isAdmin && pathname !== '/login' && isClient) {
  //   return (
  //     <div className="flex h-screen items-center justify-center bg-background">
  //       <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }
  
  // If trying to access admin pages without being logged in (and not on login page)
  // if (!isAdmin && pathname !== '/login' && isClient) return null; // Or redirect handled by useEffect

  // Simple check to not render admin layout on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }


  return (
    <SidebarProvider defaultOpen>
        <div className="flex h-screen bg-background">
          {/* Swap order: SidebarInset (main content) first, then AdminSidebar (sidebar on right) */}
          <SidebarInset className="flex-1 flex flex-col overflow-hidden">
            <header className="h-16 flex items-center justify-between px-6 border-b bg-card shrink-0">
              <SidebarTrigger className="md:hidden" /> 
              <h1 className="text-xl font-semibold text-foreground">ניהול משתלה</h1>
              {/* Add user profile, notifications etc. here */}
            </header>
            <div className="flex-1 overflow-y-auto p-0 bg-muted/30">
              {children}
            </div>
          </SidebarInset>
          <AdminSidebar /> 
        </div>
    </SidebarProvider>
  );
}

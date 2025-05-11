"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard or login page
    // This can be enhanced with authentication checks in a real app
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-4 text-muted-foreground">טוען...</p>
    </div>
  );
}


import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/toaster';
import { UserLayoutWrapper } from '@/components/UserLayoutWrapper';
import type { ReactNode } from 'react';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const roboto_mono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Gal-Ed Greens - Community Nursery',
  description: 'Order plants from the Gal-Ed community nursery.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="he" dir="rtl">
      <body 
        className={`${inter.variable} ${roboto_mono.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
      >
        <CartProvider>
          <UserLayoutWrapper>
            {children}
          </UserLayoutWrapper>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}


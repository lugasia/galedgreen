"use client";

import Link from "next/link";
import { Home, ShoppingCart, Sprout, Menu } from "lucide-react";
import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { href: "/", label: "בית", icon: Home },
  { href: "/#categories", label: "קטגוריות", icon: Sprout },
  { href: "/cart", label: "עגלה", icon: ShoppingCart, isCart: true },
];

export function UserNavbar() {
  const { getTotalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartItems = getTotalItems();

  const NavLink = ({ href, label, icon: Icon, isCart }: typeof navItems[0]) => (
    <Link href={href} passHref legacyBehavior>
      <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
        <Icon className="h-5 w-5" />
        <span>{label}</span>
        {isCart && totalCartItems > 0 && (
          <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-accent-foreground bg-accent rounded-full">
            {totalCartItems}
          </span>
        )}
      </Button>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <AppLogo />
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background p-6">
              <div className="mb-6">
                <AppLogo />
              </div>
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

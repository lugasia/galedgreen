"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"; // Assuming sidebar component exists
import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Sprout,
  ListOrdered,
  Settings,
  LogOut,
  Tags,
} from "lucide-react";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/plants", label: "ניהול צמחים", icon: Sprout },
  { href: "/admin/categories", label: "ניהול קטגוריות", icon: Tags },
  { href: "/admin/orders", label: "ניהול הזמנות", icon: ListOrdered },
  { href: "/admin/settings", label: "הגדרות", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  // Remove dummy logout logic. In the future, implement real logout here if needed.
  const handleLogout = () => {};

  return (
    <Sidebar
      variant="sidebar" // Or "floating", "inset"
      collapsible="icon" // Or "offcanvas", "none"
      side="right" // Changed from left to right
      className="border-s bg-sidebar text-sidebar-foreground w-64 min-w-64 max-w-64" // Set fixed width
    >
      <SidebarHeader className="p-4">
        <AppLogo />
      </SidebarHeader>

      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {adminNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, side: "left", className: "bg-primary text-primary-foreground" }} // Changed side to "left"
                  className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
         <SidebarMenuButton 
            onClick={handleLogout}
            className="w-full text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive data-[active=true]:bg-destructive/20 data-[active=true]:text-destructive"
            tooltip={{ children: "התנתק", side: "left", className: "bg-destructive text-destructive-foreground" }} // Changed side to "left"
          >
            <LogOut className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">התנתק</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}


import React, { memo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Users, 
  BookOpen, 
  LayoutDashboard, 
  LogIn,
  Settings,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { 
    href: "/invoices", 
    label: "Invoices", 
    icon: FileText,
    submenu: [
      { href: "/customers", label: "Customers", icon: Users }
    ]
  },
  { href: "/bookkeeping", label: "Bookkeeping", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

const Navigation = memo(() => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (href: string) => {
    setOpenSubmenu(openSubmenu === href ? null : href);
  };

  const renderMenuItem = (link: any, isSubmenuItem = false) => {
    const Icon = link.icon;
    const isActive = location.pathname === link.href;
    const hasSubmenu = link.submenu && link.submenu.length > 0;
    const isSubmenuOpen = openSubmenu === link.href;

    return (
      <SidebarMenuItem key={link.href}>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          className={cn(isSubmenuItem && "ml-4")}
          tooltip={link.label}
        >
          <Link
            to={hasSubmenu ? "#" : link.href}
            onClick={hasSubmenu ? () => toggleSubmenu(link.href) : undefined}
          >
            <Icon className="w-4 h-4" />
            <span>{link.label}</span>
            {hasSubmenu && (
              <span className="ml-auto">
                {isSubmenuOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </span>
            )}
          </Link>
        </SidebarMenuButton>
        {hasSubmenu && isSubmenuOpen && (
          <div className="mt-1">
            {link.submenu.map((subItem: any) => renderMenuItem(subItem, true))}
          </div>
        )}
      </SidebarMenuItem>
    );
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="border-b p-4">
          <img 
            src="/lovable-uploads/c0b9f3b4-6f7e-47a5-ab17-de467377618c.png" 
            alt="Logo" 
            className="h-8"
            loading="eager"
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {links.map((link) => renderMenuItem(link))}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/login" className="mt-4">
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
});

Navigation.displayName = "Navigation";

export default Navigation;
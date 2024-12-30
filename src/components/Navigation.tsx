import React, { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, User, BookOpen, LayoutDashboard, LogIn } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/customers", label: "Customers", icon: User },
  { href: "/paperwork", label: "Paperwork", icon: BookOpen },
];

const Navigation = memo(() => {
  const location = useLocation();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-border/10">
            <div className="flex items-center gap-2 px-4">
              <img 
                src="/lovable-uploads/c0b9f3b4-6f7e-47a5-ab17-de467377618c.png" 
                alt="Logo" 
                className="h-12"
                loading="eager"
              />
              <Link
                to="/login"
                className="ml-auto inline-flex items-center px-3 py-1 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-accent/50"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      asChild
                      data-active={isActive}
                      className={cn(
                        isActive && "bg-primary/10 text-primary"
                      )}
                    >
                      <Link to={link.href}>
                        <Icon className={cn(
                          "w-4 h-4 mr-2",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span>{link.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
});

Navigation.displayName = "Navigation";

export default Navigation;
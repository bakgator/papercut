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
      <div key={link.href} className="relative">
        <Link
          to={hasSubmenu ? "#" : link.href}
          onClick={hasSubmenu ? () => toggleSubmenu(link.href) : undefined}
          className={cn(
            "inline-flex items-center px-3 py-1 text-sm font-medium transition-all duration-200 rounded-lg bg-custom-element",
            isActive
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            isSubmenuItem && "ml-6"
          )}
        >
          <Icon
            className={cn(
              "w-4 h-4 mr-2 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}
          />
          {link.label}
          {hasSubmenu && (
            <span className="ml-2">
              {isSubmenuOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
          )}
        </Link>
        {hasSubmenu && isSubmenuOpen && (
          <div className="mt-1 space-y-1">
            {link.submenu.map((subItem: any) => renderMenuItem(subItem, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="bg-custom-bg py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <img 
              src="/lovable-uploads/c0b9f3b4-6f7e-47a5-ab17-de467377618c.png" 
              alt="Logo" 
              className="h-12"
              loading="eager"
            />
            <Link
              to="/login"
              className="inline-flex items-center px-3 py-1 text-sm font-medium transition-all duration-200 rounded-lg bg-custom-element text-muted-foreground hover:text-foreground hover:bg-accent/50"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Link>
          </div>
        </div>
      </div>

      <nav className="bg-custom-bg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-14">
            <div className="flex flex-col space-y-1">
              {links.map((link) => renderMenuItem(link))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
});

Navigation.displayName = "Navigation";

export default Navigation;
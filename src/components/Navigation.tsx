import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, User, BookOpen, LayoutDashboard } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/invoices", label: "Invoices", icon: FileText },
    { href: "/customers", label: "Customers", icon: User },
    { href: "/paperwork", label: "Paperwork", icon: BookOpen },
  ];

  return (
    <div className="flex flex-col">
      {/* Logo Section */}
      <div className="bg-gradient-to-br from-background via-background to-background/80 backdrop-blur-sm border-b border-border/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="text-primary w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-mono tracking-tight">Papertrail</h1>
              <p className="text-sm text-muted-foreground">Keep track of your paperwork like a pro</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="bg-gradient-to-br from-background via-background to-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16">
            <div className="flex space-x-8">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 mr-2 transition-colors", 
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
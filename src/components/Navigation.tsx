import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, User, BookOpen, LayoutDashboard, Info } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
      <div className="bg-white border-b py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-primary w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Papertrail</h1>
                <p className="text-sm text-muted-foreground">Keep track of your paperwork like a pro</p>
              </div>
            </div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>BAKGATOR AB</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[200px] p-4">
                      <div className="text-sm font-medium leading-none mb-4">Company Menu</div>
                      <div className="space-y-3">
                        <Link 
                          to="/about"
                          className="block text-sm leading-none text-muted-foreground hover:text-primary"
                        >
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            About Us
                          </div>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16">
            <div className="flex space-x-8">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                      location.pathname === link.href
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
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
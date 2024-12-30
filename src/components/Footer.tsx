import React from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-background to-card/50 backdrop-blur-sm border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted-foreground">BAKGATOR AB</span>
          </div>
          <Link 
            to="/about"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <Info className="h-4 w-4 group-hover:text-primary transition-colors" />
            About Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
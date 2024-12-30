import React from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-background via-background to-background/80 backdrop-blur-sm border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base font-mono text-muted-foreground">BAKGATOR AB</span>
          </div>
          <Link 
            to="/about"
            className="flex items-center gap-3 text-base text-muted-foreground hover:text-primary transition-colors rounded-lg px-4 py-3 hover:bg-primary/10"
          >
            <Info className="h-5 w-5 group-hover:text-primary transition-colors" />
            About Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
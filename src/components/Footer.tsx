import React from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-background via-background to-background/80 backdrop-blur-sm border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">BAKGATOR AB</span>
          </div>
          <Link 
            to="/about"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors rounded-lg px-2 py-1.5 hover:bg-primary/10"
          >
            <Info className="h-3 w-3 group-hover:text-primary transition-colors" />
            About Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
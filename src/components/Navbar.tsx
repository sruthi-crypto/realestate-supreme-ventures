import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/", label: "Properties" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm transition-shadow duration-300">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground hidden sm:inline">DreamHome</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-all duration-300 relative hover:text-primary ${location.pathname === l.to ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
            >
              {l.label}
              {location.pathname === l.to && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
              )}
            </Link>
          ))}

        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground p-2 hover:bg-muted rounded-lg transition-all duration-300"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-3 animate-slide-up">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium transition-colors duration-300 py-2 px-3 rounded-lg ${location.pathname === l.to
                ? "text-primary bg-primary/10"
                : "text-foreground hover:text-primary hover:bg-muted"
                }`}
            >
              {l.label}
            </Link>
          ))}

        </div>
      )}
    </nav>
  );
};

export default Navbar;

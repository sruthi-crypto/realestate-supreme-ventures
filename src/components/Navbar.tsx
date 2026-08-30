import { Building2, LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userToken = localStorage.getItem("user_token");
  const userPhone = localStorage.getItem("user_phone");
  const isLoggedIn = !!userToken;
  const isAdmin = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_phone");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    setMobileOpen(false);
    navigate("/");
  };

  const links = [
    { to: "/", label: "Properties" },
    { to: "/about", label: "About" },
    { to: "/packages", label: "Packages" },
    ...(isAdmin ? [{ to: "/admin/tickets", label: "Ticket Bookings" }] : []),
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
              className={`text-sm font-medium transition-all duration-300 relative hover:text-primary ${
                location.pathname === l.to ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              {l.label}
              {location.pathname === l.to && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
              )}
            </Link>
          ))}

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="w-3.5 h-3.5" />
                {userPhone}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/user-login"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Sign in
            </Link>
          )}
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
              className={`block text-sm font-medium transition-colors duration-300 py-2 px-3 rounded-lg ${
                location.pathname === l.to
                  ? "text-primary bg-primary/10"
                  : "text-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground px-3">
                <User className="w-3.5 h-3.5" /> {userPhone}
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/user-login"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

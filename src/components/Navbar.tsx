import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass-effect"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-cta flex items-center justify-center">
            <span className="text-lg">🏏</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold leading-tight text-foreground">
              Our Zone
            </span>
            <span className="text-[10px] font-medium text-muted-foreground leading-tight tracking-wider uppercase">
              Box Cricket
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors story-link">
            <span>Home</span>
          </Link>
          <a href="/#facilities" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors story-link">
            <span>Facilities</span>
          </a>
          <a href="/#gallery" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors story-link">
            <span>Gallery</span>
          </a>
          {isAuthenticated && location.pathname !== "/booking" && (
            <Link
              to="/booking"
              className="bg-gradient-cta text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all hover:shadow-lg"
            >
              Book Now
            </Link>
          )}
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user?.name || 'Profile'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/booking')}>Book Now</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          {isAuthenticated && location.pathname !== "/booking" && (
            <Link
              to="/booking"
              className="bg-gradient-cta text-primary-foreground px-4 py-2 rounded-lg font-semibold text-xs"
            >
              Book Now
            </Link>
          )}
          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-sm font-medium text-foreground">Login</Link>
                <Link to="/register" className="text-sm font-semibold text-primary">Sign Up</Link>
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-foreground truncate max-w-20">{user?.name}</span>
                <button onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t bg-card px-4 py-4 space-y-3"
        >
          <Link to="/" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground">Home</Link>
          <a href="/#facilities" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground">Facilities</a>
          <a href="/#gallery" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground">Gallery</a>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;

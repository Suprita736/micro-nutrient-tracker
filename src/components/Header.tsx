import { Link, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

const Header = () => {
  const { theme, toggle } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 md:px-10">
      <Link to="/" className="font-serif text-xl font-semibold tracking-wide text-foreground">
        MicroTrack
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          to="/dashboard"
          className={`text-sm font-sans transition-colors ${
            isActive("/dashboard") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/profile"
          className={`text-sm font-sans transition-colors ${
            isActive("/profile") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Profile
        </Link>
        <button
          onClick={toggle}
          className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </nav>
    </header>
  );
};

export default Header;

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, LogOut } from "lucide-react";
import { useTrackingStore } from "@/store/trackingStore";
import { supabase } from "@/lib/supabaseClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Header = () => {
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const userProfile = useTrackingStore((s) => s.userProfile);
  const resetStore = useTrackingStore((s) => s.reset);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {

    // logout from Supabase session
    await supabase.auth.signOut();

    // clear local Zustand state
    resetStore();

    // redirect to login page
    navigate("/login", { replace: true });

  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 md:px-10">
      <Link to="/" className="font-serif text-xl font-semibold tracking-wide text-foreground">
        MicroTrack
      </Link>

      <nav className="flex items-center gap-6">
        {userProfile && (
          <>
            <Link
              to="/dashboard"
              className={`text-sm font-sans transition-colors ${isActive("/dashboard") ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`text-sm font-sans transition-colors ${isActive("/profile") ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Profile
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="px-4 h-8 border border-primary/20 bg-transparent text-primary hover:bg-primary/5 transition-colors text-xs font-sans tracking-wide uppercase font-semibold"
                >
                  Logout
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-none border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-serif">Log out?</AlertDialogTitle>
                  <AlertDialogDescription className="font-sans">
                    Your current tracking session will be cleared. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-none font-sans">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-none bg-primary text-primary-foreground hover:bg-primary/80 font-sans"
                    onClick={handleLogout}
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}

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

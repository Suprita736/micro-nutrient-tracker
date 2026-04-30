import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "@/components/Layout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import NutrientDetail from "@/pages/NutrientDetail";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import NutritionHistory from "@/pages/NutritionHistory";
import ForgotPassword from "@/pages/ForgotPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import { useTrackingStore } from "@/store/trackingStore";
import Intro from "@/pages/Intro";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const AppInit = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const setUserProfile = useTrackingStore((s) => s.setUserProfile);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function fetchProfile(userId: string) {
      console.log("-> Starting fetchProfile for", userId);
      try {
        console.log("-> Awaiting supabase.from...");
        const res = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
        console.log("-> fetchProfile query completed!");
        
        const { data: profile, error } = res;
        console.log("User ID:", userId);
        console.log("Profile:", profile);
        console.log("Profile error:", error);

        if (!mounted) {
          console.log("-> Component unmounted, skipping state update");
          return;
        }

        if (profile) {
          console.log("-> Setting user profile in Zustand");
          setUserProfile({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            age: profile.age,
            weight: profile.weight,
            height: profile.height,
            gender: profile.gender,
            activityLevel: profile.activity_level,
            country: profile.country
          });
          
          const publicRoutes = ['/', '/login', '/signup'];
          if (publicRoutes.includes(location.pathname)) {
            console.log("-> Redirecting to dashboard from public route");
            navigate('/dashboard', { replace: true });
          }
        } else {
          console.log("-> No profile found - directing to onboarding", location.pathname);
          if (location.pathname !== '/onboarding') {
            navigate('/onboarding', { replace: true });
          }
        }
      } catch (err) {
        console.error("-> fetchProfile error:", err);
      } finally {
        console.log("-> fetchProfile finally block, setting loading false");
        if (mounted) setLoading(false);
      }
    }

    async function init() {
      console.log("-> init() started");
      try {
        console.log("-> Awaiting getSession()...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log("-> getSession() completed. Session:", !!session);
        
        if (sessionError) {
           console.error("Auth session error:", sessionError);
        }

        if (!session) {
          if (mounted) {
            console.log("-> No session, redirecting to login");
            const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/update-password', '/terms', '/privacy'];
            if (!publicRoutes.includes(location.pathname)) {
               navigate('/login', { replace: true });
            }
            setLoading(false);
          }
          return;
        }

        console.log("-> Session found, calling fetchProfile...");
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await fetchProfile(user.id);
        }
      } catch (err) {
        console.error("-> init error:", err);
        if (mounted) setLoading(false);
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("-> Auth state change event triggered:", event);
      if (!mounted) return;
      if (event === 'SIGNED_IN' && session) {
        console.log("-> Auth SIGNED_IN, calling fetchProfile...");
        // Do not await here to avoid blocking other handlers though it doesn't matter much
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) fetchProfile(user.id);
        });
      } else if (event === 'SIGNED_OUT') {
        console.log("-> Auth SIGNED_OUT, routing to login");
        useTrackingStore.getState().setUserProfile(null);
        navigate('/login', { replace: true });
      }
    });

    // Fallback un-hang mechanism:
    const timeoutMsg = setTimeout(() => {
       console.log("-> 3-SECOND TIMEOUT FALLBACK HIT. Forcing loading false.");
       if (mounted) setLoading(false);
    }, 3000);

    return () => { 
      console.log("-> AppInit UNMOUNTING");
      mounted = false; 
      clearTimeout(timeoutMsg);
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
         <div className="text-muted-foreground font-sans animate-pulse mb-4">Loading MicroTrack...</div>
      </div>
    );
  }

  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userProfile = useTrackingStore((s) => s.userProfile);
  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppInit>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/intro" element={<Intro />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nutrient/:id"
                  element={
                    <ProtectedRoute>
                      <NutrientDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <NutritionHistory />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </AppInit>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

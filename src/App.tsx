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
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        if (mounted) {
          setLoading(false);
          // Only allow landing, login, signup, and recovery/legal pages when not logged in
          const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/update-password', '/terms', '/privacy'];
          if (!publicRoutes.includes(location.pathname)) {
            navigate('/login', { replace: true });
          }
        }
        return;
      }

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();

      if (mounted) {
        if (profile) {
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
          // Redirect to dashboard if they land on public routes or already completed onboarding
          // But allow them to stay on update-password if they have a session
          const publicRoutes = ['/', '/login', '/signup', '/onboarding'];
          if (publicRoutes.includes(location.pathname)) {
            navigate('/dashboard', { replace: true });
          }
        } else {
          // If no profile, force them to onboarding
          if (location.pathname !== '/onboarding') {
            navigate('/onboarding', { replace: true });
          }
        }
        setLoading(false);
      }
    }

    init();

    return () => { mounted = false; };
  }, [navigate, location.pathname]);

  if (loading) {
    return <div className="min-h-screen bg-background" />;
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

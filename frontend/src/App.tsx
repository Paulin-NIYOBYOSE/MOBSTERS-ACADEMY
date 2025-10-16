import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { FreeDashboard } from "./components/dashboards/FreeDashboard";
import { AdminDashboard } from "./components/dashboards/AdminDashboard";
import { AcademyDashboard } from "./components/dashboards/AcademyDashboard";
import { MentorshipDashboard } from "./components/dashboards/MentorshipDashboard";
import { PaymentPage } from "./pages/PaymentPage";
import { useAuth } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const DashboardRouter = () => {
  const { hasRole, refreshUser } = useAuth();
  
  // Refresh user data when dashboard loads to ensure latest roles
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);
  
  if (hasRole("admin")) return <AdminDashboard />;
  if (hasRole("academy_student")) return <AcademyDashboard />;
  if (hasRole("mentorship_student")) return <MentorshipDashboard />;
  return <FreeDashboard />;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route
              path="/login"
              element={
                <div className="min-h-screen flex items-center justify-center p-6">
                  <LoginForm />
                </div>
              }
            />
            <Route
              path="/register"
              element={
                <div className="min-h-screen flex items-center justify-center p-6">
                  <RegisterForm />
                </div>
              }
            />

            {/* Protected */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardRouter />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/academy/*"
              element={
                <ProtectedRoute requiredRoles={["academy_student", "admin"]}>
                  <DashboardLayout>
                    <AcademyDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentorship/*"
              element={
                <ProtectedRoute requiredRoles={["mentorship_student", "admin"]}>
                  <DashboardLayout>
                    <MentorshipDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Payment Page */}
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

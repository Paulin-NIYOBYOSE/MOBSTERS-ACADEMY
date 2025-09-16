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
import { FreeDashboard } from "./components/dashboards/FreeDashboard";
import { AdminDashboard } from "./components/dashboards/AdminDashboard";
import { AcademyDashboard } from "./components/dashboards/AcademyDashboard";
import { MentorshipDashboard } from "./components/dashboards/MentorshipDashboard";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const DashboardRouter = () => {
  const { hasRole } = useAuth();
  
  if (hasRole('admin')) {
    return <AdminDashboard />;
  } else if (hasRole('academy_student')) {
    return <AcademyDashboard />;
  } else if (hasRole('mentorship_student')) {
    return <MentorshipDashboard />;
  } else {
    return <FreeDashboard />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          
          {/* Auth Routes */}
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
          
          {/* Protected Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/academy" 
            element={
              <ProtectedRoute requiredRoles={['academy_student', 'admin']}>
                <AcademyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mentorship" 
            element={
              <ProtectedRoute requiredRoles={['mentorship_student', 'admin']}>
                <MentorshipDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirects */}
          <Route path="/free" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
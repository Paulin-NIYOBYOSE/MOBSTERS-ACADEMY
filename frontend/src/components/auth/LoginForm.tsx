import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, AlertCircle, Lock, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { authService, AuthError, AuthErrorCode } from "@/services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { getDashboardRoute } from "@/utils/dashboardUtils";

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { login, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      // Use context login method which returns user data
      const loggedInUser = await login(email.trim().toLowerCase(), password);
      
      if (loggedInUser) {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          // Check if user was trying to access a specific page before login
          const from = (location.state as any)?.from?.pathname;
          
          if (from && from !== '/login') {
            // Redirect to the intended destination
            navigate(from, { replace: true });
          } else {
            // Determine appropriate dashboard based on user roles
            const dashboardRoute = getDashboardRoute(loggedInUser);
            navigate(dashboardRoute, { replace: true });
          }
        }
      }
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err);
        
        // Show specific toast messages for different error types
        let toastTitle = "Sign in failed";
        let toastDescription = err.getUserFriendlyMessage();
        
        switch (err.code) {
          case AuthErrorCode.ACCOUNT_LOCKED:
            toastTitle = "Account Locked";
            break;
          case AuthErrorCode.ACCOUNT_DISABLED:
            toastTitle = "Account Disabled";
            break;
          case AuthErrorCode.TOO_MANY_ATTEMPTS:
            toastTitle = "Too Many Attempts";
            break;
          case AuthErrorCode.USER_NOT_FOUND:
            toastTitle = "Account Not Found";
            break;
          case AuthErrorCode.INVALID_PASSWORD:
            toastTitle = "Incorrect Password";
            break;
        }
        
        toast({
          title: toastTitle,
          description: toastDescription,
          variant: "destructive",
        });
      } else {
        setError(new AuthError(AuthErrorCode.SERVER_ERROR, 'An unexpected error occurred'));
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-medium">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to your Mobsters Forex Academy account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <div className="flex items-center space-x-2">
                {error.code === AuthErrorCode.ACCOUNT_LOCKED ? (
                  <Lock className="h-4 w-4" />
                ) : error.code === AuthErrorCode.TOO_MANY_ATTEMPTS ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <div>
                  <AlertDescription className="font-medium">
                    {error.getUserFriendlyMessage()}
                  </AlertDescription>
                  {error.code === AuthErrorCode.WEAK_PASSWORD && error.details?.requirements && (
                    <div className="mt-2 text-sm">
                      <p className="font-medium">Password requirements:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {error.details.requirements.map((req: string, index: number) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) {
                  setValidationErrors(prev => ({ ...prev, email: '' }));
                }
              }}
              placeholder="Enter your email"
              disabled={loading}
              className={validationErrors.email ? 'border-red-500' : ''}
            />
            {validationErrors.email && (
              <p className="text-sm text-red-500">{validationErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
                placeholder="Enter your password"
                disabled={loading}
                className={`pr-10 ${validationErrors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-500">{validationErrors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            variant="cta"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            {onSwitchToRegister ? (
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-medium text-primary hover:text-primary-dark transition-colors underline"
              >
                Create one here
              </button>
            ) : (
              <a
                href="/register"
                className="font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Create one here
              </a>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

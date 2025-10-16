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
import { Eye, EyeOff, Loader2, UserPlus, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { authService, AuthError, AuthErrorCode } from "@/services/authService";

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string[];
  }>({ score: 0, feedback: [] });

  const { register } = useAuth();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear specific field error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general error
    setError(null);
    
    // Check password strength in real-time
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    const feedback: string[] = [];
    let score = 0;
    
    if (password.length >= 8) score++;
    else feedback.push('At least 8 characters');
    
    if (/[a-z]/.test(password)) score++;
    else feedback.push('One lowercase letter');
    
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('One uppercase letter');
    
    if (/\d/.test(password)) score++;
    else feedback.push('One number');
    
    if (/[@$!%*?&]/.test(password)) score++;
    else feedback.push('One special character (@$!%*?&)');
    
    setPasswordStrength({ score, feedback });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name.trim())) {
      errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (passwordStrength.score < 5) {
      errors.password = `Password is too weak. Missing: ${passwordStrength.feedback.join(', ')}`;
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      await authService.register(
        formData.email.trim().toLowerCase(),
        formData.name.trim(),
        formData.password
      );

      setSuccess(true);
      toast({
        title: "Registration successful!",
        description: "Your account has been created. Please sign in to continue.",
      });

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err);
        
        // Show specific toast messages for different error types
        let toastTitle = "Registration failed";
        let toastDescription = err.getUserFriendlyMessage();
        
        switch (err.code) {
          case AuthErrorCode.EMAIL_ALREADY_EXISTS:
            toastTitle = "Email Already Exists";
            break;
          case AuthErrorCode.WEAK_PASSWORD:
            toastTitle = "Password Too Weak";
            break;
          case AuthErrorCode.VALIDATION_ERROR:
            toastTitle = "Validation Error";
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

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-elegant">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Registration Successful!
          </CardTitle>
          <CardDescription>
            Your account has been created successfully. Redirecting to sign
            in...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            variant="cta"
            onClick={() => (window.location.href = "/login")}
            className="w-full"
          >
            Go to Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-elegant">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>
          Join Mobsters Forex Academy community and start your trading journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
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
                  {error.code === AuthErrorCode.VALIDATION_ERROR && error.details?.validationErrors && (
                    <div className="mt-2 text-sm">
                      <ul className="list-disc list-inside space-y-1">
                        {error.details.validationErrors.map((err: string, index: number) => (
                          <li key={index}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={loading}
              className={validationErrors.name ? 'border-red-500' : ''}
            />
            {validationErrors.name && (
              <p className="text-sm text-red-500">{validationErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
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
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
                className={`pr-10 ${validationErrors.password ? 'border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-500">{validationErrors.password}</p>
            )}
            
            {/* Password strength indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score <= 2 ? 'bg-red-500' :
                        passwordStrength.score <= 3 ? 'bg-yellow-500' :
                        passwordStrength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    passwordStrength.score <= 2 ? 'text-red-500' :
                    passwordStrength.score <= 3 ? 'text-yellow-500' :
                    passwordStrength.score <= 4 ? 'text-blue-500' : 'text-green-500'
                  }`}>
                    {passwordStrength.score <= 2 ? 'Weak' :
                     passwordStrength.score <= 3 ? 'Fair' :
                     passwordStrength.score <= 4 ? 'Good' : 'Strong'}
                  </span>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="text-xs text-gray-600">
                    <span>Missing: {passwordStrength.feedback.join(', ')}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              disabled={loading}
              className={validationErrors.confirmPassword ? 'border-red-500' : ''}
            />
            {validationErrors.confirmPassword && (
              <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="cta"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            {onSwitchToLogin ? (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-semibold text-primary hover:text-primary-dark transition-colors underline"
              >
                Sign in here
              </button>
            ) : (
              <a
                href="/login"
                className="font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                Sign in here
              </a>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

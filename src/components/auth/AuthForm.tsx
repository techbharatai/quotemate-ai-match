import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import ForgotPasswordModal from './ForgotPasswordModal';
import { API_BASE_URL } from '@/config/constants';
import {
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  Building,
  CheckCircle2,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  userType: z.enum(["builder", "subcontractor"], {
    required_error: "Please select a user type",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

interface AuthFormProps {
  type: 'login' | 'signup';
}


const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Form setup
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", userType: undefined }
  });

  // ✅ Real API Login Function
  const handleRealLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Sending login request to backend...');
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();
      console.log('📥 Login response:', result);

      if (response.ok && result.success) {
        // Successful login
        const userData = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role
        };

        login(userData, rememberMe);
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });

        // Role-based navigation
        switch (userData.role) {
          case 'builder':
            navigate('/builder-dashboard');
            break;
          case 'subcontractor':
            navigate('/subcontractor');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        // Login failed
        toast({
          title: "Sign in failed",
          description: result.message || "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Real API Signup Function
  const handleRealSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Sending signup request to backend...');
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          userType: data.userType
        }),
      });

      const result = await response.json();
      console.log('📥 Signup response:', result);

      if (response.ok && result.success) {
        // Successful signup
        toast({
          title: "Account created successfully",
          description: `Welcome to QuoteMate! Your ${data.userType} account is ready.`,
        });
        navigate('/login');
      } else {
        // Signup failed
        toast({
          title: "Sign up failed",
          description: result.message || "Could not create account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Login Form Component
  if (type === 'login') {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
          <Card className="w-full max-w-md shadow-xl border-0 bg-gradient-to-br from-card to-card/95">
            <CardHeader className="space-y-4 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                <CardDescription>Sign in to your account to continue</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={loginForm.handleSubmit(handleRealLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className={cn(
                        "pl-10",
                        loginForm.formState.errors.email && "border-destructive"
                      )}
                      disabled={isLoading}
                      {...loginForm.register("email")}
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={cn(
                        "pl-10 pr-10",
                        loginForm.formState.errors.password && "border-destructive"
                      )}
                      disabled={isLoading}
                      {...loginForm.register("password")}
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember" className="text-sm">Remember me</Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Sign in
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <ForgotPasswordModal
          isOpen={forgotPasswordOpen}
          onClose={() => setForgotPasswordOpen(false)}
        />
      </>
    );
  }

  // Signup Form Component
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-gradient-to-br from-card to-card/95">
        <CardHeader className="space-y-4 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <Building className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
            <CardDescription>Join QuoteMate and start connecting with professionals</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={signupForm.handleSubmit(handleRealSignup)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={cn(
                    "pl-10",
                    signupForm.formState.errors.email && "border-destructive"
                  )}
                  disabled={isLoading}
                  {...signupForm.register("email")}
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
              {signupForm.formState.errors.email && (
                <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>
              )}
            </div>

            {/* User Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="userType">I am a</Label>
              <Select 
                onValueChange={(value) => signupForm.setValue("userType", value as "builder" | "subcontractor")}
                disabled={isLoading}
              >
                <SelectTrigger className={cn(signupForm.formState.errors.userType && "border-destructive")}>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="builder">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Builder - I need subcontractors for my projects
                    </div>
                  </SelectItem>
                  <SelectItem value="subcontractor">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Subcontractor - I provide services to builders
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {signupForm.formState.errors.userType && (
                <p className="text-sm text-destructive">{signupForm.formState.errors.userType.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={cn(
                    "pl-10 pr-10",
                    signupForm.formState.errors.password && "border-destructive"
                  )}
                  disabled={isLoading}
                  {...signupForm.register("password")}
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {signupForm.formState.errors.password && (
                <p className="text-sm text-destructive">{signupForm.formState.errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={cn(
                    "pl-10 pr-10",
                    signupForm.formState.errors.confirmPassword && "border-destructive"
                  )}
                  disabled={isLoading}
                  {...signupForm.register("confirmPassword")}
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {signupForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">{signupForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Create account
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;

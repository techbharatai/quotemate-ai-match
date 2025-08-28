import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import ForgotPasswordModal from './ForgotPasswordModal';
import {
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  Building,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // ✅ Fixed: Consistent mock users with proper admin roles
  const mockUsers = [
    { id: "1", email: "builder@example.com", password: "password123", role: "builder" as const, name: "Builder User" },
    { id: "2", email: "subcontractor@example.com", password: "password123", role: "subcontractor" as const, name: "Subcontractor User" },
    { id: "3", email: "admin@quotemate.com", password: "admin123", role: "admin" as const, name: "Admin User" },
    { id: "4", email: "admin2@example.com", password: "admin123", role: "admin" as const, name: "Admin User 2" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ✅ Fixed: Find user from mock data instead of inferring role from email
      const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
      
      if (user) {
        // ✅ Remove password from user object and use exact role from data
        const { password, ...userWithoutPassword } = user;
        
        console.log('Found user:', userWithoutPassword); // Debug log
        
        login(userWithoutPassword, rememberMe);
        
        toast({
          title: "Welcome back!",
          description: `Signed in as ${user.role}`,
        });

        // ✅ Fixed: Proper role-based navigation
        switch (user.role) {
          case 'builder':
            navigate('/upload');
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
        toast({
          title: "Sign in failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Added: Demo login functionality
  const handleDemoLogin = (role: "builder" | "subcontractor" | "admin") => {
    const demoUser = mockUsers.find(u => u.role === role);
    if (demoUser) {
      setValue("email", demoUser.email);
      setValue("password", demoUser.password);
      
      // Auto-submit after a short delay
      setTimeout(() => {
        const form = document.querySelector('form');
        if (form) {
          form.requestSubmit();
        }
      }, 100);
    }
  };

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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={cn(
                      "pl-10",
                      errors.email && "border-destructive"
                    )}
                    disabled={isLoading}
                    {...register("email")}
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
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
                      errors.password && "border-destructive"
                    )}
                    disabled={isLoading}
                    {...register("password")}
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
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
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
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Quick Demo Access</span>
              </div>
            </div>

            {/* ✅ Enhanced Demo Login Buttons */}
            <div className="grid grid-cols-1 gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 transition-all duration-200 hover:scale-[1.02] hover:bg-primary/5 border-primary/20"
                onClick={() => handleDemoLogin("builder")}
                disabled={isLoading}
              >
                <Building className="mr-2 h-4 w-4" />
                Builder Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 transition-all duration-200 hover:scale-[1.02] hover:bg-primary/5 border-primary/20"
                onClick={() => handleDemoLogin("subcontractor")}
                disabled={isLoading}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Contractor Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 transition-all duration-200 hover:scale-[1.02] hover:bg-primary/5 border-destructive/20"
                onClick={() => handleDemoLogin("admin")}
                disabled={isLoading}
              >
                <Lock className="mr-2 h-4 w-4" />
                Admin Demo
              </Button>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Test Credentials */}
            <div className="p-4 bg-muted/30 rounded-lg border">
              <p className="text-sm font-medium mb-2">Demo Credentials:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>🏗️ Builder: builder@example.com / password123</div>
                <div>👷 Contractor: subcontractor@example.com / password123</div>
                <div>👨‍💼 Admin: admin@quotemate.com / admin123</div>
                <div>👨‍💼 Admin2: admin2@example.com / admin123</div>
              </div>
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
};

export default LoginForm;

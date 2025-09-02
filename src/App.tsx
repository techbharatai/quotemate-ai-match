import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AuthForm from "./components/auth/AuthForm";
import Builder from "./pages/Builder";
import BuilderDashboard from "./pages/BuilderDashboard";
import Subcontractor from "./pages/Subcontractor";
import Processing from "./pages/Processing";
import SubcontractorResults from "./pages/SubcontractorResults";
import NotFound from "./pages/NotFound";
import UploadsPage from "./pages/UploadsPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext";

const queryClient = new QueryClient();

// Enhanced Protected Route Component
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ✅ Enhanced Role-based route protection with admin override
const RequireRole = ({ children, allowedRoles }: { 
  children: JSX.Element; 
  allowedRoles: Array<"builder" | "subcontractor" | "admin"> 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Admin can access all routes
  if (user.role === 'admin' || allowedRoles.includes(user.role)) {
    return children;
  }

  return <Navigate to="/unauthorized" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <ProjectProvider>
            <Routes>
              {/* ✅ Updated: Homepage with role-based redirect */}
              <Route path="/" element={<Homepage />} />
              
              {/* Public Routes */}
              <Route path="/signin" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<AuthForm type="login" />} />
              <Route path="/signup" element={<AuthForm type="signup" />} />
              
              {/* Builder Routes (Admin can also access) */}
              <Route path="/upload" element={
                <RequireRole allowedRoles={["builder"]}>
                  <UploadsPage />
                </RequireRole>
              } />
              <Route path="/builder" element={
                <RequireRole allowedRoles={["builder"]}>
                  <Builder />
                </RequireRole>
              } />
              <Route path="/builder-dashboard" element={
                <RequireRole allowedRoles={["builder"]}>
                  <BuilderDashboard />
                </RequireRole>
              } />
              
              {/* Subcontractor Routes (Admin can also access) */}
              <Route path="/subcontractor" element={
                <RequireRole allowedRoles={["subcontractor"]}>
                  <Subcontractor />
                </RequireRole>
              } />
              <Route path="/subcontractor-results" element={
                <RequireRole allowedRoles={["subcontractor"]}>
                  <SubcontractorResults />
                </RequireRole>
              } />
              
              {/* Shared Protected Routes */}
              <Route path="/processing" element={
                <RequireAuth>
                  <Processing />
                </RequireAuth>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin-dashboard" element={
                <RequireRole allowedRoles={["admin"]}>
                  <div className="min-h-screen bg-background p-8">
                    <div className="max-w-4xl mx-auto">
                      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
                      <p className="text-muted-foreground mb-8">Admin panel with full system access</p>
                      
                      {/* Quick Access Links for Admin */}
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                        <div className="p-6 border rounded-lg bg-card">
                          <h3 className="font-semibold mb-2">Users Management</h3>
                          <p className="text-2xl font-bold mb-2">145</p>
                          <div className="space-y-2">
                            <a href="/upload" className="block text-sm text-primary hover:underline">
                              → Builder Dashboard
                            </a>
                            <a href="/subcontractor" className="block text-sm text-primary hover:underline">
                              → Subcontractor Dashboard
                            </a>
                          </div>
                        </div>
                        <div className="p-6 border rounded-lg bg-card">
                          <h3 className="font-semibold mb-2">Active Projects</h3>
                          <p className="text-2xl font-bold">67</p>
                        </div>
                        <div className="p-6 border rounded-lg bg-card">
                          <h3 className="font-semibold mb-2">Revenue</h3>
                          <p className="text-2xl font-bold">$45,231</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </RequireRole>
              } />
              
              {/* Error Routes */}
              <Route path="/unauthorized" element={
                <div className="min-h-screen flex items-center justify-center bg-background">
                  <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
                    <p className="text-muted-foreground">You don't have permission to access this page</p>
                    <div className="space-x-4">
                      <button 
                        onClick={() => window.history.back()} 
                        className="text-primary hover:underline"
                      >
                        Go Back
                      </button>
                      <span className="text-muted-foreground">|</span>
                      <a href="/login" className="text-primary hover:underline">
                        Login
                      </a>
                    </div>
                  </div>
                </div>
              } />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </ProjectProvider>
          </AuthProvider>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

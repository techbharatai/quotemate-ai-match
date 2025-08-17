import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignIn from "./pages/SignIn";
import RoleSelection from "./pages/RoleSelection";
import Builder from "./pages/Builder";
import BuilderDashboard from "./pages/BuilderDashboard";
import Subcontractor from "./pages/Subcontractor";
import Processing from "./pages/Processing";
import SubcontractorResults from "./pages/SubcontractorResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/builder-dashboard" element={<BuilderDashboard />} />
          <Route path="/subcontractor" element={<Subcontractor />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/subcontractor-results" element={<SubcontractorResults />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

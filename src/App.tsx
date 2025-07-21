import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Layout/Navbar";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";
import PendingApproval from "./pages/PendingApproval";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/pending" element={<PendingApproval />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/how-it-works" element={<HowItWorks />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

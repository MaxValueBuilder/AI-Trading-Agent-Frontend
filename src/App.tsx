import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from '@vercel/analytics/react';
import "./lib/i18n";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Index";
import BitiqCopilot from "./pages/BitiqCopilot";
import AutoTrading from "./pages/AutoTrading";
import HowItWorks from "./pages/HowItWorks";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Subscription from "./pages/Subscription";
import PaymentSuccess from "./pages/PaymentSuccess";
import Documentation from "./pages/Documentation";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
// Legal pages - Dynamic route
import LegalPage from "./pages/legal/LegalPage";
import { useEffect } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';
import { onForegroundMessage, getFCMToken } from '@/lib/firebase';
import { useSignalsRefreshStore } from '@/stores/signalsRefreshStore';
import { useRTL } from '@/hooks/useRTL';

const queryClient = new QueryClient();

// Create a component to handle notification initialization
const NotificationInitializer = () => {
  useEffect(() => {
    console.log("🚀 App: Initializing notifications...");
    
    // Load persisted state
    useNotificationStore.getState().loadFromStorage();
    // Set up Firebase message listener
    const unsubscribe = onForegroundMessage();
    
    return () => {
      if (unsubscribe) {
        console.log("🚀 App: Cleaning up Firebase listener");
        unsubscribe();
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

// Component to handle RTL
const RTLHandler = () => {
  useRTL(); // This will handle the RTL setup
  return null;
};

// Component to handle language initialization
const LanguageInitializer = () => {
  useEffect(() => {
    // Ensure language is loaded from localStorage on app startup
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      // Force i18n to use the saved language
      import('./lib/i18n').then(({ default: i18n }) => {
        if (i18n.language !== savedLanguage) {
          i18n.changeLanguage(savedLanguage);
        }
      });
    }
  }, []);

  return null;
};

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <NotificationInitializer />
            <LanguageInitializer />
            <RTLHandler />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/subscription/success" element={<PaymentSuccess />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                
                {/* Legal pages - Dynamic route */}
                <Route path="/legal/:slug" element={<LegalPage />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/copilot" element={<ProtectedRoute><BitiqCopilot /></ProtectedRoute>} />
                <Route path="/auto-trading" element={<ProtectedRoute><AutoTrading /></ProtectedRoute>} />
                <Route path="/documentation" element={<ProtectedRoute><Documentation /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
    <Analytics />
  </HelmetProvider>
);

export default App;

import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navigation from "./components/Navigation";

const Index = lazy(() => import("./pages/Index"));
const NewDashboard = lazy(() => import("./pages/NewDashboard"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Customers = lazy(() => import("./pages/Customers"));
const NewCustomer = lazy(() => import("./pages/NewCustomer"));
const NewInvoice = lazy(() => import("./pages/NewInvoice"));
const Paperwork = lazy(() => import("./pages/Paperwork"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

const App = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen w-full">
            <Navigation />
            <main className="flex-1 w-full">
              <Suspense fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 rounded-full border-4 border-primary border-r-transparent animate-spin"></div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<NewDashboard />} />
                  <Route path="/invoices" element={<Dashboard />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/customers/new" element={<NewCustomer />} />
                  <Route path="/customers/:id/edit" element={<NewCustomer />} />
                  <Route path="/invoices/new" element={<NewInvoice />} />
                  <Route path="/invoices/:id/edit" element={<NewInvoice />} />
                  <Route path="/invoices/:id" element={<Index />} />
                  <Route path="/paperwork" element={<Paperwork />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
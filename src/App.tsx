import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NewDashboard from "./pages/NewDashboard";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import NewCustomer from "./pages/NewCustomer";
import NewInvoice from "./pages/NewInvoice";
import Navigation from "./components/Navigation";
import Paperwork from "./pages/Paperwork";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
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
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;